import {useDynamicList, useLatest, useMap, useUpdateEffect} from "ahooks";
import {rearrangeAnt, deepCopy} from './util';
import {useCallback, useMemo, useRef, useState} from "react";
import lodash from "lodash";

let markedArr = [];

export interface Item {
  uid: string;
  desc: string;
  isEdit: boolean;
}

export interface SaveStore {
  uid: string,
  desc?: string,
  offsetTop?: number,
  isEdit?: boolean;
}

export function useAnnotation() {
  const [callItem, setCallItem] = useState<any>();
  let [map, {set, get, setAll, remove}] = useMap<string, Item>([]);
  let mapLast = useLatest(map);

  console.log('useAnnotation', {map});

  useUpdateEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    calcPositions(callItem);
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    setBorderColor(callItem.uid);
  }, [callItem]);

  //重新计算所有的位置
  function calcPositions({offsetTop, hasEdit, uid}) {
    const marked = document.querySelector(`[data-uid="${uid}"]`) as HTMLDivElement;
    console.log('marked', {marked});

    const height = marked.offsetHeight;
    let top = offsetTop;
    if (!offsetTop) {
      top = window.getComputedStyle(marked).top;
      top = Number(top.slice(0, top.length - 2));
    }
    let markedData = [];
    const data = [top, height + top, marked];
    const dataS = markedArr.filter((item) => item[2] !== marked);
    if (hasEdit) {
      markedData = rearrangeAnt(data, deepCopy(dataS), 2);
    } else {
      markedData = markedArr = rearrangeAnt(data, dataS, 2);
    }

    markedData.forEach((item) => {
      item[2].style.top = item[0] + "px";
    });
  }

  // 清除编辑状态的备注器
  let clearEdit = () => {
    let newMap: Map<string, Item> = new Map(mapLast.current);
    newMap.forEach((value, key, map) => {
      value.isEdit = false;
      map.set(key, value);
    });
    setAll(newMap);
  };

  function _remove(uid: string) {
    let item = get(uid);
    if (item) remove(uid)
    console.log('markedArr', markedArr);
    const marked = document.querySelector(`[data-uid="${uid}"]`);
    const markedIndex = markedArr.findIndex((item) => item[2] === marked);
    if (item) {
      markedArr.splice(markedIndex, 1);
    }
  }

  function addRecord({uid, offsetTop, desc, isEdit = false}: SaveStore, hasStoreRender = false) {
    // debugger
    let activeItem = get(uid);
    if (activeItem) {
      if (isEdit) {
        clearEdit();
        markedArr.forEach((item) => {
          item[2].style.top = item[0] + "px";
        });
      }
      if (desc) {
        activeItem.desc = desc;
      }
      activeItem.isEdit = isEdit;
      set(uid, activeItem);
    } else {
      set(uid, {uid, desc: desc, isEdit: false})
    }
    setCallItem({offsetTop, uid, hasEdit: isEdit});
  }

  function addEditRecord({uid, desc, offsetTop, isEdit = false}: SaveStore) {
    clearEdit();
    set(uid, {uid, desc: undefined, isEdit: true});
    setCallItem({offsetTop, uid, hasEdit: true});
  }


  // 设置侧边颜色
  function setBorderColor(uid: string) {
    let eleArr = document.querySelector(`span[data-selector="${uid}"]`);
    const bg = window.getComputedStyle(eleArr).backgroundColor;
    const marked = document.querySelector(`[data-uid="${uid}"]`) as HTMLDivElement;
    marked.style.borderColor = bg;
  }

  return {
    list: Array.from(map.values()),
    setBorderColor: setBorderColor,
    add: addRecord,
    addEdit: addEditRecord,
    remove: _remove,
  }
}
