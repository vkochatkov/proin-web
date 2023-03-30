import React from 'react';
import ReactDOM from 'react-dom';
import './Backdrop.scss';

interface Props {
  onClick: () => void;
}

export const Backdrop: React.FC<Props> = ({ onClick }: Props) => {
  return ReactDOM.createPortal(
    <div className="backdrop" onClick={onClick}></div>,
    //@ts-ignore
    document.getElementById('backdrop-hook')
  );
};
