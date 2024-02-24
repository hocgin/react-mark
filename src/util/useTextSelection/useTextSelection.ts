import {useRef, useState} from 'react';
import type {BasicTarget} from 'ahooks/lib/utils/domTarget';
import {getTargetElement} from 'ahooks/lib/utils/domTarget';
import useEffectWithTarget from 'ahooks/lib/utils/useEffectWithTarget';
import {getTextNodes, initVTextNodes, splitVTextNode} from "./util";

interface Rect {
  top: number;
  left: number;
  bottom: number;
  right: number;
  height: number;
  width: number;
  end: number;
  start: number;
}

export interface State extends Rect {
  text: string;
}

const initRect: Rect = {
  top: NaN,
  left: NaN,
  bottom: NaN,
  right: NaN,
  height: NaN,
  width: NaN,
  end: NaN,
  start: NaN,
};

const initState: State = {
  text: '',
  ...initRect,
};

function getRectFromSelection(selection: Selection | null, el: Element | Document): Rect {
  if (!selection) {
    return initRect;
  }

  if (selection.rangeCount < 1) {
    return initRect;
  }
  const range = selection.getRangeAt(0);
  const nodeValue = selection.focusNode?.nodeValue;
  let markContent = el.textContent;
  const sCntr = range.startContainer as Node as Text;
  const eCntr = range.endContainer as Node as Text;

  // 获取元素下所有文本节点
  initVTextNodes(getTextNodes(el, []));

  console.log('markContent', {markContent, nodeValue, range});

  // 根据选中的文本节点去计算位置
  const endTextNext = splitVTextNode(eCntr, range.endOffset) as any;
  const startText = splitVTextNode(sCntr, range.startOffset) as any;
  // if (!startText || !endTextNext) return;
  const start = startText?.offset;
  const end = endTextNext?.offset;

  console.log('startText', {startText, sCntr});
  const {height, width, top, left, right, bottom} = range.getBoundingClientRect();
  return {
    height,
    width,
    top,
    left,
    right,
    bottom,
    end,
    start
  };
}

export function useTextSelection(target?: BasicTarget<Document | Element>): State {
  const [state, setState] = useState(initState);

  const stateRef = useRef(state);
  const isInRangeRef = useRef(false);
  stateRef.current = state;

  useEffectWithTarget(
    () => {
      const el = getTargetElement(target, document);
      if (!el) {
        return;
      }

      const mouseupHandler = () => {
        let selObj: Selection | null = null;
        let text = '';
        let rect = initRect;
        if (!window.getSelection) return;
        selObj = window.getSelection();
        // if (selObj.rangeCount <= 0) return;
        text = selObj ? selObj.toString() : '';
        if (text && isInRangeRef.current) {
          rect = getRectFromSelection(selObj, el);
          setState({...state, text, ...rect});
        }
      };

      // 任意点击都需要清空之前的 range
      const mousedownHandler = (e) => {
        // 如果是鼠标右键需要跳过 这样选中的数据就不会被清空
        if (e.button === 2) return;

        if (!window.getSelection) return;
        if (stateRef.current.text) {
          setState({...initState});
        }
        isInRangeRef.current = false;
        const selObj = window.getSelection();
        if (!selObj) return;
        selObj.removeAllRanges();
        isInRangeRef.current = el.contains(e.target);
      };

      el.addEventListener('mouseup', mouseupHandler);

      document.addEventListener('mousedown', mousedownHandler);

      return () => {
        el.removeEventListener('mouseup', mouseupHandler);
        document.removeEventListener('mousedown', mousedownHandler);
      };
    },
    [],
    target,
  );

  return state;
}
