import React, {useEffect} from "react"
import ReactDOM from "react-dom";
import {useMark} from "@hocgin/marks";
import DOMIterator from '../mark.js/domiterator.js';

const elementId = 'test';

export default () => {
  useEffect(() => {
    if (document.getElementById(elementId)) return;

    let element = document.createElement('div');
    element.attachShadow({mode: 'open'});
    element.id = elementId;
    let shadowRoot = element.shadowRoot;
    ReactDOM.render(<WebMask />, shadowRoot, () => {
      // 获取 body 元素
      let body = document.body;
      if (body.parentNode) {
        // 在 body 元素的后面插入新的段落
        body.parentNode.insertBefore(element, document.body);
      }
    });
  }, []);

  return <></>;
}

const WebMask = () => {
  let [markElement] = useMark(() => document.querySelector("html"), {});
  useEffect(() => {
    console.log('WebMask');

    new DOMIterator(document.querySelector("html")).forEachNode(NodeFilter.SHOW_TEXT, node => {
      console.log('node', node);
    });

  }, []);

  return <>{markElement}</>
}
