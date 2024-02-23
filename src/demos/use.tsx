import React, {useRef} from "react";
import {useMark} from "@hocgin/marks";


export default () => {
  let bodyRef = useRef<HTMLDivElement | any>();
  let {list, unmark} = useMark({el: bodyRef});
  console.log('useMark.list', {list});


  return <div>
    <div ref={bodyRef}>
      Hi
      Hi
      Hi
      Hi
      <p>sdkjksjkdkjskdjkjsdkjkdjk</p>
      <p>kdkjsksdkdkjskkjksjkdkjskkdkjskkdkjskdjkjsdkjkdjk</p>
    </div>
    <hr />
    <div>
      <h1>Note:</h1>
      {list.map((e, key) => {
        return <div key={`${key}`} data-uid={e.uid} onClick={() => unmark(e.uid)}>{e.desc ?? 'empty'}</div>
      })}
    </div>


  </div>;
}
