import React from 'react';
import {Button} from 'antd';
import {useState} from 'react';
import Icon, {CaretRightOutlined, CaretLeftOutlined} from '@ant-design/icons';
import './index.less';

export const Dropdown: React.FC<{
  open?: boolean;
  renderIcon?: (color: string) => any;
  onClick?: (event: Event, color: string) => void;
  onLeftClick?: React.MouseEventHandler<HTMLElement>;
}> = ({renderIcon, onClick, ...props}) => {
  let [color, setColor] = useState<string>('#000');
  return (
    <div className={`Mark-ColorDropdown`}>
      <Button type="text"
              onClick={onClick?.bind(this, color)}
              className={`Mark-LeftBtn`}>
        <Icon component={renderIcon?.bind(this, color)} />
      </Button>
      <Button onClick={props?.onLeftClick} type="text" className={`Mark-RightBtn`}>
        {props?.open ? <CaretLeftOutlined /> : <CaretRightOutlined />}
      </Button>
    </div>
  );
};


