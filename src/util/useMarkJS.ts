import {useEffect, useRef} from "react";
import Mark from "../mark.js/mark.js";
import {ColorList} from "@hocgin/marks/panel";

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
  text: string;
  note?: string;
  start: number;
  end: number;
}

interface MarkJSOption {
  onClickMark: (id: string, event: any) => void;
}

export let DefaultMarkColor = `rgba(${ColorList?.[0]}, 0.3)`;

export function useMarkJS(target: () => Element, option?: MarkJSOption) {
  let markRef = useRef<Mark>();

  useEffect(() => {
    let context = target();
    markRef.current = new Mark(context);
  }, []);
  let queryMarkElement = (id: string) => document.querySelector(`*[data-selector="${id}"]`) as HTMLElement;

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
            if (option.onClickMark) {
              element.onclick = option.onClickMark.bind(this, id)
            }
          },
          acrossElements: true,
          debug: true
        });
      }
      return id;
    },
    unmark: (id: string) => {
      let ins = markRef.current;
      ins.unmark({
        className: `mask-selected-${id}`,
        debug: true
      })
    },
    getMarkRect: (id: string) => {
      let maskEl = queryMarkElement(id);
      if (!maskEl) return;
      const {height, width, top, left, right, bottom} = maskEl.getBoundingClientRect();
      return {height, width, top, left, right, bottom} as MaskRect;
    },
    showAll: () => {

    },
    show: () => {

    },
  };
}
