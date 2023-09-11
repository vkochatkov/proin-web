import React from 'react';
import { Header } from './Header';
import { NavLinks } from './NavLInks';

import './MainNavigation.scss';

interface Props {
  // children: ReactNode;
}

export const MainNavigation: React.FC<Props> = () => {
  return (
    <>
      <Header>
        <nav className='main-navigation__drawer-nav'>
          <NavLinks />
        </nav>
      </Header>
    </>
  );
};
