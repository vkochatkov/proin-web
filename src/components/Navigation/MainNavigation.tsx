import React, { ReactNode } from 'react';
import { Header } from './Header';
import './MainNavigation.scss';

interface Props {
  children: ReactNode;
}

export const MainNavigation: React.FC<Props> = (props) => {
  const openDrawerHandler = () => {};
  return (
    <>
      <Header>
        <button
          className="main-navigation__menu-btn"
          onClick={openDrawerHandler}
        >
          <span />
          <span />
          <span />
        </button>
        {props.children}
      </Header>
    </>
  );
};
