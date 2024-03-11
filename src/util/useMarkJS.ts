import {useEffect, useRef} from "react";
import Mark from "../mark.js/mark.js";
import {ColorList} from "@hocgin/marks/panel";
import {BasicTarget, getTargetElement} from "ahooks/lib/utils/domTarget";

export interface MaskRect {
  top: number;
  left: number;
  bottom: number;
  right: number;
  height: number;
  width: number;
}

interface ItemType {
  id?: string;
  text?: string;
  note?: string;
  start: number;
  end: number;
}

interface MarkJSOption {
  onClickMark?: (id: string, event: any) => void;
}

export let DefaultMarkColor = `rgba(${ColorList?.[0]}, 0.3)`;
const debug = false;

/**
 *
 * @param target
 * @param option
 */
export function useMarkJS(target?: BasicTarget<Document | Element>, option?: MarkJSOption) {
  let markRef = useRef<Mark>();

  useEffect(() => {
    let context = getTargetElement(target, document);
    markRef.current = new Mark(context);
  }, []);
  let queryMarkElement = (id: string) => document.querySelector(`*[data-selector="${id}"]`) as HTMLElement;

  let unmark = (id: string) => {
    let ins = markRef.current;
    ins.unmark({className: `mask-selected-${id}`, debug})
  };
  return {
    getTextNodes: () => {
      let ins = markRef.current;
      ins.getTextNodes(({value, nodes}) => {
        console.log('getTextNodes', {value, nodes});
      });
    },
    // 标记 或者 更新
    mark: (item: ItemType, color: string = DefaultMarkColor) => {
      let ins = markRef.current;
      let id = item.id;
      let maskEl = queryMarkElement(id);
      if (maskEl) {
        maskEl.style.backgroundColor = color;
      } else {
        ins.markRanges([{start: item.start, length: item.end - item.start}], {
          className: `mask-selected-${id}`,
          // element: 'span',
          each: (element: HTMLElement, range) => {
            element.setAttribute("data-selector", id)
            element.style.backgroundColor = color;
            if (option?.onClickMark) {
              element.onclick = option.onClickMark.bind(this, id)
            }
          },
          acrossElements: true,
          debug
        });
      }
      return id;
    },
    unmark,
    getMarkRect: (id: string) => {
      let maskEl = queryMarkElement(id);
      if (!maskEl) return;
      const {height, width, top, left, right, bottom} = maskEl.getBoundingClientRect();
      return {height, width, top, left, right, bottom} as MaskRect;
    },
    hideAll: () => {
      let elements = document.querySelectorAll<Element>(`*[data-selector]`) as NodeListOf<Element>;
      elements.forEach(e => {
        let id = e.getAttribute('data-selector');
        unmark(id);
      });
    },
  };
}
