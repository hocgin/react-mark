import React, {useRef, useState} from "react";
import {useMarkSelector} from "./useMarkSelector";
import {useAnnotation} from "./useAnnotation";

interface MarkOption {
  el: React.MutableRefObject<Element | any>;
}

export function useMark(option: MarkOption) {
  const descText = useRef<string>();
  const activeUidRef = useRef<string>();
  let {list: records, remove: removeRecord, add: addRecord, addEdit: addEditRecord} = useAnnotation();
  let {mark, unmark} = useMarkSelector({
    el: option.el,
    // [点击标注] 点击后，进入编辑和填写备注界面
    onClick: ({uid}) => {
      let activeUid = activeUidRef.current;
      console.log('useMarkSelector.onClick', {descText, uid, activeUid});
      if (activeUid === uid) return;
      activeUidRef.current = uid;
      const marked = document.querySelector(`[data-uid="${uid}"]`);
      if (!marked) return;
      descText.current = marked.textContent;
      addRecord({uid, isEdit: true}, true)
    },
    // [选中文字] 选中进行颜色标记
    onMarked: ({uid, offsetTop, desc, hasStoreRender}) => {
      console.log('useMarkSelector.onMarked', {uid, offsetTop, desc, hasStoreRender});
      descText.current = "";
      if (hasStoreRender) {
        addRecord({uid, desc, offsetTop,}, hasStoreRender);
      } else {
        addEditRecord({uid, offsetTop});
        activeUidRef.current = uid;
      }
      // setBorderColor(uid);
    },
    onUnMarked: () => {

    },
  });

  return {
    list: records,
    mark,
    unmark: (uid: string) => {
      console.log('useMark.unmark', {uid});
      removeRecord(uid);
      unmark(uid);
    },
  };
}
