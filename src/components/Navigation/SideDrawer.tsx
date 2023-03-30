import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';
import './SideDrawer.scss';

interface Props {
  children: ReactNode;
  show: boolean;
  onClick: () => void;
}

export const SideDrawer: React.FC<Props> = ({
  children,
  show,
  onClick,
}: Props) => {
  const content = (
    <CSSTransition
      classNames="slide-in-left"
      timeout={200}
      in={show}
      mountOnEnter
      unmountOnExit
    >
      <aside className="side-drawer" onClick={onClick}>
        {children}
      </aside>
    </CSSTransition>
  );
  //@ts-ignore
  return ReactDOM.createPortal(content, document.getElementById('drawer-hook'));
};
