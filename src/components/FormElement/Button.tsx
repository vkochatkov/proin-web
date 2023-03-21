import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import './Button.scss';

interface Props {
  children: ReactNode;
  href?: string;
  to?: string;
  type?: 'button' | 'submit' | 'reset';
  size?: 'default' | 'small' | 'large';
  inverse?: boolean;
  danger?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  transparent?: boolean;
  icon?: boolean;
}

export const Button: React.FC<Props> = ({
  children,
  href,
  to,
  type = 'button',
  size = 'default',
  inverse = false,
  danger = false,
  onClick,
  disabled = false,
  transparent = false,
  icon = false,
}) => {
  const buttonClassList = `button ${icon && 'button__icon'} button--${size} ${
    inverse ? 'button--inverse' : ''
  } ${danger ? 'button--danger' : ''} ${
    transparent ? 'button--transparent' : ''
  }`;

  if (href) {
    return (
      <a className={buttonClassList} href={href}>
        {children}
      </a>
    );
  }
  if (to) {
    return (
      <Link
        to={to}
        // exact={exact}
        className={buttonClassList}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      className={buttonClassList}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
