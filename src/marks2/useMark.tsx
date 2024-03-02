import {useAsyncEffect, useBoolean, useTimeout, useUpdateEffect} from "ahooks";
import React, {useMemo, useState} from "react";
import {useTextSelection} from "../util/useTextSelection";
import {MarkCard, ValueType} from "../MarkCard";
import {nanoid} from "nanoid";
import {StorageKit} from "../util/storage";
import {DefaultUserConfig, MaskEntity, UserConfig} from "../type";
import {MaskRect, useMarkJS} from "../util/useMarkJS";

type MaskState = MaskEntity & MaskRect;

interface Option {
  storageKey?: string;
  // 模式: 画笔 / 手动
  mode?: 'pencil' | 'manual';
  queryAll?: (key: string) => Promise<MaskEntity[]>
  remove?: (key: string, id: string) => Promise<void>
  query?: (key: string, id: string) => Promise<MaskEntity>
  saveOrUpdate?: (key: string, entity: MaskEntity) => Promise<void>
  //
  getUserConfig?: (key: string) => UserConfig
  saveUserConfig?: (key: string, config: UserConfig) => void
  //
  timeout?: number;
}

/**
 *
 * - 手动标注
 * - 自动标注
 * @param target
 * @param option
 */
export const useMark = (target: () => Element, option?: Option) => {
  let [isShow, setIsShow] = useState<boolean>(false);
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
    fixLeft = Math.min(window.innerWidth - 100, fixLeft);
    return {fixTop: fixTop, fixLeft: fixLeft}
  }, [maskState]);

  useAsyncEffect(async () => {
    // 初始化用户配置
    let userConfig = await getUserConfig(storageKey);
    setUserConfig(userConfig);
  }, []);

  useTimeout(async () => {
    // 初始化备注
    await showAll();
    // 延迟初始化，防止节点渲染未完全导致渲染位置出现错误
  }, option?.timeout ?? 0);

  const showAll = async () => {
    setIsShow(true);
    let all = await queryAll(storageKey);
    all.forEach(e => mark(e, e.color));
  };

  let {mark, unmark, getMarkRect, hideAll} = useMarkJS(target, {
    onClickMark: async (id, event) => {
      // todo: bug 3. 弹窗点击不消失
      // todo: feature 笔记内容标识，可以一键全部展示
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
    value.color = value.color ?? userConfig?.color;
    mark({id: value.id, text, note: value?.note, start, end}, value.color);
    let maskEntity = {text, start, end, ...value};
    setMaskState({left, top, height, right, width, bottom, ...maskEntity});
    if (value.color !== userConfig?.color) {
      let newConfig = {...userConfig, color: value.color};
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
      <div className={'ignore'} style={maskStyle} onMouseDown={e => {
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
  </>, {
    isShow,
    // 显示标注
    showAll,
    // 隐藏标注
    hideAll: () => {
      setIsShow(false);
      hideAll();
    },
  }] as const;
};
