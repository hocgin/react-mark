import React, {useMemo, useState} from "react";
import {HighlightDropdown} from "../Dropdown/HighlightDropdown";
import classNames from "classnames";
import './index.less';
import './index.MarkNoteCard.less';
import {useBoolean, useControllableValue, useUpdateEffect} from "ahooks";
import {ColorSelect} from "../index";
import {Editor} from "@hocgin/editor";
import {DeleteFilled} from "@ant-design/icons";
import {DefaultMarkColor} from "../util/useMarkJS";
import {MaskEntity} from "../type";
import {Button} from '../Button';
import {Divider} from '../Divider';

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

  console.log('MarkCard.value', {value, color});
  return <div className={classNames('Mark-Card', {
    ['Mark-CardOpen']: open
  })}>
    <div className={'Mark-CardHead'}>
      <HighlightDropdown color={color} open={open} onLeftClick={toggleOpen}
                         onClick={() => props?.onChange({color, ...value})} />
      {open ? <>
        <div className={"Mark-CardHeadRight"}>
          <div className={"Mark-CardHeadRightInner"}>
            <Divider />
            <ColorSelect value={color} onChange={(color) => setValue(v => ({...v, color}))} />
          </div>
          <Button onClick={() => props?.onRemove?.(value?.id)}><DeleteFilled /></Button>
        </div>
      </> : <></>}
    </div>
    {open ? <div className={classNames('Mark-CardBody')}>
      <Editor editable={true} value={value?.note} onChange={(note) => setValue(v => ({...v, note}))} />
    </div> : <></>}
  </div>;
}

// index.MarkNoteCard.less
interface MarkNoteCardOption {
  value: MaskEntity;
  onChange?: (value: MaskEntity) => void
  onRemove?: (id: string) => void;
  className?: string;
  footer?: React.ReactElement;
}

export const MarkNoteCard: React.FC<MarkNoteCardOption> = React.forwardRef(({...props}) => {
  let [open, {toggle: toggleOpen}] = useBoolean(false);
  const [value, setValue] = useState(props?.value);
  useUpdateEffect(() => {
    props?.onChange?.(value);
  }, [value]);
  return <div className={classNames("MarkNote-Card", props.className)}>
    <div className={classNames("MarkNote-CardHead")} style={{borderColor: value?.color}}>
      {value?.text}
    </div>
    <div className={classNames("MarkNote-CardBody")}>
      <HighlightDropdown color={value?.color} open={open} onLeftClick={toggleOpen} />
      <div className={"MarkNote-CardHeadRight"}>
        {open ? <div className={"MarkNote-CardHeadRightInner"}>
          <Divider />
          <ColorSelect value={value?.color} onChange={(color) => setValue(v => ({...v, color}))} />
        </div> : <div style={{flex: '1 1'}} />}
        <Button onClick={() => props?.onRemove?.(value?.id)}><DeleteFilled /></Button>
      </div>
    </div>
    {open ? <div className={classNames('MarkNote-CardFooter')}>
      <Editor editable={true} value={value?.note} onChange={(note) => setValue(v => ({...v, note}))} />
    </div> : <></>}
    {props?.footer}
  </div>;
});


