import React, {useRef} from "react";
import {useMark} from "../marks";
import {Panel} from "../panel";


export default () => {
  let bodyRef = useRef<HTMLDivElement | any>();
  let {list = [], unmark, update} = useMark({el: bodyRef});
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
        return <Panel editable={e.isEdit} defaultValue={{uid: e.uid, text: e.desc}}
                      onRemove={({uid}) => unmark(uid)}
                      onSubmit={e => update({uid: e.uid, color: e.color, desc: e.text, isEdit: false})}
                      onClose={e => update({uid: e.uid, color: e.color, desc: e.text, isEdit: false})} />
      })}
    </div>
    <hr />
    <Panel editable={false} defaultValue={{color: 'red', text: "666"}}
           onSubmit={console.log.bind(this, 'Panel.onSubmit')} />
  </div>;
}
