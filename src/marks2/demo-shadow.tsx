import React, {useEffect} from "react"
import ReactDOM from "react-dom";
import {useMark} from "@hocgin/marks";

const elementId = 'test';

document.addEventListener('DOMContentLoaded', async () => {

});
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
  let [markElement] = useMark(() => document.querySelector("body"), {});
  return <>{markElement}</>
}
