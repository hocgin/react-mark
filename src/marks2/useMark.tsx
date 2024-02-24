import {useAsyncEffect, useBoolean, useClickAway, useUpdateEffect} from "ahooks";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {useTextSelection} from "@hocgin/marks/util/useTextSelection";
import {MaskPos, useMarkJS} from "@hocgin/marks/util/useMarkJS";
import {MarkCard, ValueType} from "@hocgin/marks/MarkCard";
import {nanoid} from "nanoid";

type MaskState = MaskEntity & MaskPos;

interface MaskEntity {
  id?: string;
  color?: string;
  end: number;
  start: number;
  text: string;
  note?: string;
}


async function query(key: string, id: string) {
  let item = localStorage.getItem(id);
  console.log('query', id, item);
  if (item) {
    return JSON.parse(item) as MaskEntity;
  }
}

async function saveOrUpdate(key: string, entity: MaskEntity) {
  let value = JSON.stringify(entity);
  console.log('saveOrUpdate', {entity});
  localStorage.setItem(entity.id, value);
}

async function remove(key: string, id: string) {
  localStorage.removeItem(id);
}

async function queryAll(key: string) {
  let result = [];
  for (let i = 0; i < localStorage.length; i++) {
    let item = localStorage.getItem(localStorage.key(i));
    result.push(JSON.parse(item));
  }
  return result as MaskEntity[];
}

interface Option {
  key?: string;
}

/**
 *
 * - 手动标注
 * - 自动标注
 * @param target
 * @param option
 */
export const useMark = (target: () => Element, option?: Option) => {
  let [open, {set: setOpen}] = useBoolean(false);
  // let [show, {set: setShow}] = useBoolean(option?.show);
  let panelRef = useRef<HTMLDivElement>();
  const [maskState, setMaskState] = useState<MaskState>();
  let {text, start, end, left, top, height, right, width, bottom} = useTextSelection(target);
  let {fixTop, fixLeft} = useMemo(() => {
    return {fixTop: (maskState?.top + maskState?.height) ?? 0, fixLeft: (maskState?.left + maskState?.width) ?? 0}
  }, [maskState]);

  useAsyncEffect(async () => {
    let all = await queryAll(option?.key);
    all.forEach(e => mark(e, e.color));
  }, []);


  // useClickAway((e) => {
  //   console.log('useClickAway', {e});
  //   setOpen(false);
  // }, panelRef);

  let {mark, unmark, getPos} = useMarkJS(target, {
    onClickMark: async (id, event) => {
      console.log('click Mask');
      // todo: bug 3. 弹窗点击不消失
      // todo: feature 笔记内容标识，可以一键全部展示
      // todo: feature 画笔模式，开始画
      // todo: feature 存储选中的画笔(用户配置)
      let entity = await query(option?.key, id);
      let maskPos = getPos(id);
      setMaskState({...entity, ...maskPos});
      setOpen(true);
    },
  });
  useUpdateEffect(() => {
    if (!text?.length) {
      setOpen(false);
      return;
    }
    setMaskState({text, start, end, left, top, height, right, width, bottom})
    setOpen(true);
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
  let onChange = (value: ValueType) => {
    console.log('value', value);
    value.id = value?.id ?? nanoid(11);
    mark({id: value.id, text, note: value?.note, start, end}, value.color);
    let maskEntity = {text, start, end, ...value};
    setMaskState({left, top, height, right, width, bottom, ...maskEntity});
    saveOrUpdate(option?.key, maskEntity);

    // {text, start, end, left, top, height, right, width, bottom, ...value}
  };
  let onRemove = (id: string) => {
    unmark(id);
    setMaskState(undefined);
    setOpen(false);
    remove(option?.key, id);
  };

  return [<>
    {/*笔记标记*/}
    {/*弹窗部分*/}
    {open ? <>
      <div ref={panelRef} style={maskStyle} onMouseDown={e => {
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopPropagation();
        e.nativeEvent.preventDefault();
        e.nativeEvent.stopImmediatePropagation();
        return false
      }}>
        <MarkCard value={maskState} onChange={onChange} onRemove={onRemove} />
      </div>
    </> : <></>}
  </>] as const;
};
