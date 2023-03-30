import React from 'react';
import { NavLink } from 'react-router-dom';
import '../Navigation/NavLinks.scss';

export const NavLinks = () => {
  return (
    <nav className="nav-links">
      <li>
        <NavLink to="/">PROJECTS</NavLink>
      </li>
    </nav>
  );
};
