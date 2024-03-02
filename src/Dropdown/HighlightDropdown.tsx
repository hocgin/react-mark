import React from "react";
import {Dropdown} from './index';
import {HighlightColor} from './svg';


interface HighlightProps {
  color?: string;
  open?: boolean;
  onClick?: (event: Event) => void;
  onLeftClick?: React.MouseEventHandler<HTMLElement>;
}

export const HighlightDropdown: React.FC<HighlightProps> = ({...props}) => {
  return <Dropdown open={props?.open} renderIcon={HighlightColor.bind(this, props?.color)} onClick={props.onClick}
                   onLeftClick={props.onLeftClick} />;
};

