import React, {useMemo, useState} from "react";
import {HighlightDropdown} from "../Dropdown/HighlightDropdown";
import classNames from "classnames";
import './index.less';
import {useBoolean, useControllableValue} from "ahooks";
import {ColorSelect} from "../index";
import {Button, Divider} from "antd";
import {Editor} from "@hocgin/editor";
import {DeleteFilled} from "@ant-design/icons";
import {ColorList} from "@hocgin/marks/panel";
import {DefaultMarkColor} from "../util/useMarkJS";

export interface ValueType {
  id?: string;
  color?: string;
  // 选中文本
  text?: string;
  // 笔记内容
  note?: string;
}

interface MarkCardProps {
  onChange?: (value: ValueType) => void
  onRemove?: (id: string) => void;
  value: ValueType;
}

export const MarkCard: React.FC<MarkCardProps> = ({...props}) => {
  const [open, {toggle: toggleOpen}] = useBoolean(false);
  const [value, setValue] = useControllableValue<ValueType>(props, {
    defaultValue: undefined,
  });
  let color = useMemo(() => value?.color ?? DefaultMarkColor, [value?.color]);

  console.log('MarkCard.value', {value});
  return <div className={classNames('Mark-Card', {
    ['Mark-CardOpen']: open
  })}>
    <div className={'Mark-CardHead'}>
      <HighlightDropdown color={color} open={open} onLeftClick={toggleOpen}
                         onClick={() => props?.onChange({color, ...value})} />
      {open ? <>
        <div className={"Mark-CardHeadRight"}>
          <div className={"Mark-CardHeadRightInner"}>
            <Divider type={'vertical'} orientationMargin={0} />
            <ColorSelect value={color} onChange={(color) => setValue(v => ({...v, color}))} />
          </div>
          <Button size={'small'} type={"text"} onClick={() => props?.onRemove?.(value?.id)}
                  ghost><DeleteFilled /></Button>
        </div>
      </> : <></>}
    </div>
    {open ? <div className={classNames('Mark-CardBody')}>
      <Editor editable={true} value={value?.note} onChange={(note) => setValue(v => ({...v, note}))} />
    </div> : <></>}
  </div>;
}



