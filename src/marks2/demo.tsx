import React, {useEffect, useMemo, useRef, useState} from "react";
import {useMark} from "./useMark";
import {useMarkNote} from "./useMarkNote";
import {StorageKit} from "../util/storage";


export default () => {
  let contentRef = useRef<HTMLDivElement>();
  let [nodeElements] = useMarkNote({
    storageKey: 'MK',
    scroll: async (key, params) => {
      let list = await StorageKit.queryAll(key);
      return {
        records: list,
        nextId: undefined,
        hasMore: false
      };
    },
    saveOrUpdate: StorageKit.saveOrUpdate,
    remove: StorageKit.remove,
  });
  let [element] = useMark(() => contentRef.current, {
    // mode: 'pencil'
  });
  return <>
    {element}
    <div style={{display: 'flex', flexDirection: 'row'}}>
      <div ref={contentRef} style={{flex: '1 1'}}>
        Hi
        Hi
        Hi
        <h1>Hi</h1>
        <div>A1234567890</div>
        <img />
        <p>B1234567890</p>
        <p>C1234567890</p>
        <p>\n</p>
      </div>
      <div style={{width: 500}}>
        <h1>目录</h1>
        <div>
          {nodeElements}
        </div>
      </div>
    </div>

  </>;
};
