import JsMark from "js-mark";
import React, {useEffect, useRef} from "react";

interface MarkSelectorOption {
  el: React.MutableRefObject<Element>;
  defaultValue?: MaskItem[];
  activeClassName?: string;
  onClick?: (item: any) => void;
  onMarked?: (item: ClickSelectInfo) => void;
  onUnMarked?: () => void;
}

interface MaskItem {
  offset: number;
  text: string;
  uid: string;
  desc: string;
  className: string;
}

export interface ClickSelectInfo {
  offsetTop: number;  //选中文本相对于根结点的偏移量
  uid: string;   //选中的文本
  desc: string;   //选中的文本
  hasStoreRender: boolean; //用户自定义参数
}


export interface SelectInfo {
  offset: number;  //选中文本相对于根结点的偏移量
  text: string;   //选中的文本
  storeRenderOther?: any; //用户自定义参数
}


export function useMarkSelector(option: MarkSelectorOption) {
  let jsMarkRef = useRef<JsMark>();
  useEffect(() => {
    let el = option.el.current;
    console.log('el', el);
    let jsMark = new JsMark({
      el: el,
      options: {
        isCover: true,
        beautify: true,
        ignoreClass: ["ignore1", "ignore"],
      },
    });
    jsMarkRef.current = jsMark;
    jsMark.onSelected = (res) => {
      let activeClassName = option.activeClassName;
      let onMarked = option.onMarked;
      let onClick = option.onClick;
      let {uid, offsetTop} = jsMark.repaintRange({
        uuid: res.storeRenderOther.uid,
        textNodes: res.textNodes,
        className: res.storeRenderOther.className || activeClassName,
      });

      console.log('jsMark.onSelected', {res, uid, offsetTop});

      onMarked?.({
        uid,
        offsetTop,
        desc: res.storeRenderOther.desc,
        hasStoreRender: res.hasStoreRender,
      });

      if (!res.hasStoreRender) {
        // setLocal({
        //   offset: res.offset,
        //   text: res.text,
        //   uid,
        //   desc: "",
        //   className:className.value,
        // });
      }
      jsMark.onClick = function ({uid, offsetTop, offsetLeft}) {
        onClick?.({uid, offsetTop, offsetLeft});
      };
    };
  }, []);

  console.log('option', option);
  return {
    mark: (select: SelectInfo[] = []) => {
      let jsMark = jsMarkRef.current;
      jsMark.renderStore(select);
    },
    unmark: (uid: string) => {
      let jsMark = jsMarkRef.current;
      jsMark.deleteMark(uid);
    },
  };
}
