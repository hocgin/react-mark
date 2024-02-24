import React, {useEffect, useMemo, useRef, useState} from "react";
import {useBoolean, useClickAway, useUpdateEffect} from "ahooks";
import {MarkCard, ValueType} from "../MarkCard";
import {useTextSelection} from '../util/useTextSelection';
import {useMarkJS} from '../util/useMarkJS';
import {nanoid} from "nanoid";
import {useMark} from "./useMark";


export default () => {
  let contentRef = useRef<HTMLDivElement>();
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
      <div style={{width: 200}}>
        <h1>目录</h1>
      </div>
    </div>

  </>;
};
