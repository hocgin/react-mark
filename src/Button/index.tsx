import React from "react";
import classNames from "classnames";
import './index.less';

interface ButtonProps {
  children?: React.ReactElement | string;
  onClick?: React.MouseEventHandler<HTMLElement>;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({children, ...props}) => {
  return <button type={"button"} className={classNames('Mark-Button', props.className)} onClick={props.onClick}>
    <span>{children}</span>
  </button>;
};
