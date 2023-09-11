import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { getAuth } from '../../modules/selectors/user';
import WorkIcon from '@mui/icons-material/Work';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import InfoIcon from '@mui/icons-material/Info';
import { PROJECTS_PATH } from '../../config/routes';

import '../Navigation/NavLinks.scss';

export const NavLinks = () => {
  const { token } = useSelector(getAuth);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className='nav-links'>
      {token && (
        <>
          <li className='nav-links__item'>
            <NavLink to={PROJECTS_PATH} className='nav-links__link-wrapper'>
              <WorkIcon />
              <p>Проекти</p>
            </NavLink>
          </li>
          <li className='nav-links__item'>
            <NavLink to='/tasks' className='nav-links__link-wrapper'>
              <AccountBalanceIcon />
              <p>Задачі</p>
            </NavLink>
          </li>
          <li className='nav-links__item'>
            <NavLink to='/transactions' className='nav-links__link-wrapper'>
              <AssignmentIcon />
              <p>Транзакції</p>
            </NavLink>
          </li>
          <li className='nav-links__item'>
            <button onClick={handleLogout} className='nav-links__link-wrapper'>
              <ExitToAppIcon />
              <p>Вийти</p>
            </button>
          </li>
        </>
      )}
      {!token && (
        <>
          <li>
            <NavLink to='/auth' className='nav-links__link-wrapper'>
              <PersonAddIcon />
              <p>Реєстрація</p>
            </NavLink>
          </li>
          <li>
            <NavLink to='/about' className='nav-links__link-wrapper'>
              <InfoIcon />
              <p>Про нас</p>
            </NavLink>
          </li>
        </>
      )}
    </nav>
  );
};
