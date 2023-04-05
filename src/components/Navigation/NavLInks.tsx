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
          <li>
            <NavLink to="/">PROJECTS</NavLink>
          </li>
          <li>
            <button onClick={handleLogout}>LOGOUT</button>
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
