import React, {useRef} from "react";
import {Panel, useMark} from "@hocgin/marks";


export default () => {
  let bodyRef = useRef<HTMLDivElement | any>();
  let {list, unmark} = useMark({el: bodyRef});
  console.log('useMark.list', {list});

  let markedStyle = {
    borderLeft: '8px solid #fff',
    paddingLeft: 5,
  };


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
        return <div style={markedStyle} key={`${key}`} data-uid={e.uid}
                    onClick={() => unmark(e.uid)}>{e.desc ?? 'empty'}</div>
      })}
    </div>
    <hr />
    <Panel />

  </div>;
}
