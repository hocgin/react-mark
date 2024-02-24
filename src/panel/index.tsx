import React, {useMemo, useState} from "react";
import {Editor} from '@hocgin/editor';
import './index.less';
import classNames from "classnames";
import {useControllableValue} from "ahooks";

interface ValueType {
  uid?: string;
  color?: string;
  text?: string;
}

interface PanelProps {
  className?: string;
  defaultValue?: ValueType;
  editable?: boolean;
  onSubmit?: (value: ValueType) => void;
  onClose?: (value: ValueType) => void;
  onRemove?: (value: ValueType) => void;
}

export const Panel: React.FC<PanelProps> = ({...props}) => {
  let [value, setValue] = useState<ValueType>(props?.defaultValue);
  let editable = useMemo(() => props?.editable, [props?.editable]);

  return <div data-uid={value?.uid} style={{borderColor: value.color}}
              className={classNames('MarkPanelBox', props.className,
                (editable ? 'Editable' : 'NotEditable')
              )}>
    {editable ? <>
      <div className={'MarkPanelEditorBox'}>
        {/*  颜色 */}
        <div className={classNames("MarkPanelBar")}>
          <ColorSelect value={value?.color} onChange={(color) => setValue(v => ({...v, color}))} />
          <div className={classNames("MarkPanelGroup")}>
            <Button onClick={() => props?.onSubmit?.(value)}>保存</Button>
            <Button onClick={() => props?.onClose?.(value)}>关闭</Button>
          </div>
        </div>
        {/*  文本*/}
        <Editor editable={props?.editable} value={value?.text} onChange={(text) => setValue(v => ({...v, text}))} />
        {/* 操作按钮 */}
      </div>
    </> : <>
      <Editor editable={props?.editable} value={value?.text} />
    </>}
  </div>;
}

export let ColorList = [
  '255, 255, 0',
  '55, 128, 134',
  '209, 47, 138',
  '184, 67, 182',
  '120, 62, 245',
  '28, 79, 136',
  '189, 89, 40',
  '146, 112, 40',
  '113, 109, 106',
  '59, 112, 228',
];

interface ColorSelectProps {
  value?: string;
  onChange?: (value: string) => void;
}

export const ColorSelect: React.FC<ColorSelectProps> = ({...props}) => {
  const [selectColor, setSelectColor] = useControllableValue<string>(props, {
    defaultValue: undefined,
  });
  return <div className={classNames('ColorSelect')}>
    {ColorList.map((color, key) => {
      let backgroundColor = `rgb(${color})`;
      let selectBackgroundColor = `rgba(${color}, 0.3)`;
      return <div key={key} className={classNames('ColorSelectItem', {
        ['active']: selectColor === selectBackgroundColor,
      })} onClick={() => setSelectColor(selectBackgroundColor)}>
        <div className={classNames('ColorSelectItemInner')} style={{backgroundColor: backgroundColor}} />
      </div>;
    })}
  </div>
}

interface ButtonProps {
  children?: React.ReactElement | string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({children, ...props}) => {
  return <button type={"button"} className={classNames('Button')} onClick={props.onClick}>
    <span>{children}</span>
  </button>;
};
