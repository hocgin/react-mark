import React, {useState} from "react";
import {Editor} from '@hocgin/editor';
import './index.less';
import classNames from "classnames";


interface PanelProps {
  className?: string;
}

export const Panel: React.FC<PanelProps> = ({...props}) => {
  return <div className={classNames('MarkPanelBox', props.className)}>
    {/*  颜色 */}
    <ColorSelect />
    {/*  文本*/}
    <Editor editable={true} value={'你好'} />
    {/* 操作按钮 */}
    <div className={classNames("MarkPanelBar")}>
      <Button>保存</Button>
      <Button>取消</Button>
    </div>
  </div>;
}

let colors = [
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
  defaultValue?: string;
}

const ColorSelect: React.FC<ColorSelectProps> = ({...props}) => {
  let [selectColor, setSelectColor] = useState<string>(props?.defaultValue);
  return <div className={classNames('ColorSelect')}>
    {colors.map(color => {
      let backgroundColor = `rgb(${color})`;
      return <div className={classNames('ColorSelectItem', {
        ['active']: selectColor === backgroundColor,
      })} onClick={() => setSelectColor(backgroundColor)}>
        <div className={classNames('ColorSelectItemInner')} style={{backgroundColor: backgroundColor}} />
      </div>;
    })}
  </div>
}

interface ButtonProps {
  children?: React.ReactElement | string;
}

const Button: React.FC<ButtonProps> = ({children, ...props}) => {
  return <button type={"button"} className={classNames('Button')}>
    <span>{children}</span>
  </button>;
};
