import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAuth } from '../../modules/selectors/user';

import '../Navigation/NavLinks.scss';

export const NavLinks = () => {
  const { token } = useSelector(getAuth);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="nav-links">
      {token && (
        <>
          <li className="nav-links__item">
            <NavLink to="/">Проекти</NavLink>
          </li>
          <li className="nav-links__item">
            <NavLink to="/tasks">Задачі</NavLink>
          </li>
          <li className="nav-links__item">
            <button onClick={handleLogout}>Вийти</button>
          </li>
        </>
      )}
      {!token && (
        <li>
          <NavLink to="/auth">Реєстрація</NavLink>
        </li>
      )}
    </nav>
  );
};
