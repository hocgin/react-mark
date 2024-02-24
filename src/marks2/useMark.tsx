import {useAsyncEffect, useBoolean, useClickAway, useUpdateEffect} from "ahooks";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {useTextSelection} from "@hocgin/marks/util/useTextSelection";
import {DefaultMarkColor, MaskRect, useMarkJS} from "@hocgin/marks/util/useMarkJS";
import {MarkCard, ValueType} from "@hocgin/marks/MarkCard";
import {nanoid} from "nanoid";

type MaskState = MaskEntity & MaskRect;

interface MaskEntity {
  id?: string;
  color?: string;
  end: number;
  start: number;
  text: string;
  note?: string;
}

interface UserConfig {
  color?: string;
}

class StorageKit {

  static query = async (key: string, id: string) => {
    key = `${key}-ME-${id}`;
    let item = localStorage.getItem(key);
    console.log('query', key, item);
    if (item) {
      return JSON.parse(item) as MaskEntity;
    }
  }

  static saveOrUpdate = async (key: string, entity: MaskEntity) => {
    let id = entity.id;
    key = `${key}-ME-${id}`;
    let value = JSON.stringify(entity);
    console.log('saveOrUpdate', {entity});
    localStorage.setItem(key, value);
  }

  static remove = async (key: string, id: string) => {
    key = `${key}-ME-${id}`;
    localStorage.removeItem(key);
  }

  static queryAll = async (key: string) => {
    key = `${key}-ME`;

    let result = [];
    for (let i = 0; i < localStorage.length; i++) {
      let ukey = localStorage.key(i);
      if (!ukey.startsWith(key)) continue;
      let item = localStorage.getItem(ukey);
      result.push(JSON.parse(item));
    }
    return result as MaskEntity[];
  }

  /// ===========

  static saveUserConfig = async (key: string, config: UserConfig) => {
    key = `${key}-UC`;
    console.log('saveUserConfig', config);
    localStorage.setItem(key, JSON.stringify(config));
  };

  static getUserConfig = async (key: string) => {
    key = `${key}-UC`;
    let text = localStorage.getItem(key);
    if (!text) {
      return DefaultUserConfig;
    }
    return JSON.parse(text);
  };
}


interface Option {
  storageKey?: string;
  // 模式: 画笔 / 手动
  mode: 'pencil' | 'manual';
  queryAll?: (key: string) => Promise<MaskEntity[]>
  remove?: (key: string, id: string) => Promise<void>
  query?: (key: string, id: string) => Promise<MaskEntity>
  saveOrUpdate?: (key: string, entity: MaskEntity) => Promise<void>
  //
  getUserConfig?: (key: string) => UserConfig
  saveUserConfig?: (key: string, config: UserConfig) => void
}

let DefaultUserConfig = {color: DefaultMarkColor};
/**
 *
 * - 手动标注
 * - 自动标注
 * @param target
 * @param option
 */
export const useMark = (target: () => Element, option?: Option) => {
  let [open, {set: setOpen}] = useBoolean(false);
  let [userConfig, setUserConfig] = useState<UserConfig>(DefaultUserConfig);
  const {storageKey, queryAll, query, remove, saveOrUpdate, getUserConfig, saveUserConfig} = useMemo(() => {
    return {
      queryAll: option?.queryAll ?? StorageKit.queryAll,
      query: option?.query ?? StorageKit.query,
      remove: option?.remove ?? StorageKit.remove,
      saveOrUpdate: option?.saveOrUpdate ?? StorageKit.saveOrUpdate,
      saveUserConfig: option?.saveUserConfig ?? StorageKit.saveUserConfig,
      getUserConfig: option?.getUserConfig ?? StorageKit.getUserConfig,
      storageKey: option?.storageKey ?? 'MK',
    };
  }, [option]);

  // panelRef = useRef<HTMLDivElement>();
  const [maskState, setMaskState] = useState<MaskState>();
  let {text, start, end, left, top, height, right, width, bottom} = useTextSelection(target);
  let {fixTop, fixLeft} = useMemo(() => {
    let fixTop = (maskState?.top + maskState?.height) ?? 0;
    let fixLeft = (maskState?.left + maskState?.width) ?? 0;
    return {fixTop: fixTop, fixLeft: fixLeft}
  }, [maskState]);

  useAsyncEffect(async () => {
    // 初始化备注
    let all = await queryAll(storageKey);
    all.forEach(e => mark(e, e.color));

    // 初始化用户配置
    let userConfig = await getUserConfig(storageKey);
    setUserConfig(userConfig);
  }, []);

  // useClickAway((e) => {
  //   console.log('useClickAway', {e});
  //   setOpen(false);
  // }, panelRef);

  let {mark, unmark, getMarkRect} = useMarkJS(target, {
    onClickMark: async (id, event) => {
      console.log('click Mask');
      // todo: bug 3. 弹窗点击不消失
      // todo: feature 笔记内容标识，可以一键全部展示
      // todo: feature 存储选中的画笔(用户配置)
      let entity = await query(storageKey, id);
      let maskPos = getMarkRect(id);
      setMaskState({...entity, ...maskPos});
      setOpen(true);
    },
  });
  useUpdateEffect(() => {
    if (!text?.length) {
      setOpen(false);
      return;
    }
    setMaskState({text, start, color: userConfig?.color, end, left, top, height, right, width, bottom})
    setOpen(true);
    console.log('option', option?.mode === 'pencil', {userConfig});
    if (option?.mode === 'pencil') {
      saveMark({text})
    }
    console.log('可以进行标注操作', {text});
  }, [text]);

  let maskStyle = {
    display: open ? 'block' : 'none',
    // ==========
    zIndex: 998,
    position: 'fixed',
    top: `${fixTop}px`,
    left: `${fixLeft}px`,
  } as React.CSSProperties;

  /**
   * 进行持久化
   * @param value
   */
  let saveMark = (value: ValueType) => {
    console.log('value', value);
    value.id = value?.id ?? nanoid(11);
    let color = value.color ?? userConfig?.color;
    mark({id: value.id, text, note: value?.note, start, end}, color);
    let maskEntity = {text, start, end, ...value};
    setMaskState({left, top, height, right, width, bottom, ...maskEntity});
    if (color !== userConfig?.color) {
      let newConfig = {...userConfig, color};
      setUserConfig(newConfig);
      saveUserConfig(storageKey, newConfig);
    }
    saveOrUpdate(storageKey, maskEntity);
  };
  let onRemove = (id: string) => {
    unmark(id);
    setMaskState(undefined);
    setOpen(false);
    remove(storageKey, id);
  };

  return [<>
    {/*笔记标记*/}
    {/*弹窗部分*/}
    {open ? <>
      <div style={maskStyle} onMouseDown={e => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopPropagation();
        e.nativeEvent.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        return false
      }}>
        <MarkCard value={maskState} onChange={saveMark} onRemove={onRemove} />
      </div>
    </> : <></>}
  </>] as const;
};
