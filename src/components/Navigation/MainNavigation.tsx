import React, { ReactNode, useState } from 'react';
import { Header } from './Header';
import { SideDrawer } from './SideDrawer';
import { NavLinks } from './NavLInks';
import { Backdrop } from '../UIElements/Backdrop';

import './MainNavigation.scss';

interface Props {
  children: ReactNode;
}

export const MainNavigation: React.FC<Props> = (props) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const handleOpenDrawer = () => {
    setDrawerIsOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerIsOpen(false);
  };

  return (
    <>
      {drawerIsOpen && <Backdrop onClick={handleCloseDrawer} />}
      <SideDrawer show={drawerIsOpen} onClick={handleCloseDrawer}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      <Header>
        <button
          className="main-navigation__menu-btn"
          onClick={handleOpenDrawer}
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
