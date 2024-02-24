import {useEffect, useRef} from "react";
import JsMark from "js-mark";

export interface SelectInfo {
  offset: number;  //选中文本相对于根结点的偏移量
  text: string;   //选中的文本
  storeRenderOther?: any; //用户自定义参数
}

export interface Item {
  uid: string;
  text: string;
  color?: string;
}


interface Option {
}

export function useJsMark(target: () => Element, option?: Option) {
  let markRef = useRef<JsMark>();

  useEffect(() => {
    let el = target?.();
    console.log('el', {el});
    let jsMark = new JsMark({
      el: el,
      options: {
        isCover: true,
        beautify: true,
        ignoreClass: ["ignore1", "ignore"],
      },
    });
    markRef.current = jsMark;
  }, []);

  return {
    mark: (select: SelectInfo[] = []) => {
      let jsMark = markRef.current;
      jsMark.renderStore(select);
    },
    unmark: (uid: string) => {
      let jsMark = markRef.current;
      jsMark.deleteMark(uid);
    },
  } as const;
}
