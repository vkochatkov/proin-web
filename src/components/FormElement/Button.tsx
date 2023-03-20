import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import './Button.scss';

interface Props {
  children: ReactNode;
  href?: string;
  to?: string;
  exact?: boolean;
  type?: 'button' | 'submit' | 'reset';
  size?: 'default' | 'small' | 'large';
  inverse?: boolean;
  danger?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<Props> = ({
  children,
  href,
  to,
  exact,
  type = 'button',
  size = 'default',
  inverse = false,
  danger = false,
  onClick,
  disabled = false,
}) => {
  if (href) {
    return (
      <a
        className={`button button--${size} ${
          inverse ? 'button--inverse' : ''
        } ${danger ? 'button--danger' : ''}`}
        href={href}
      >
        {children}
      </a>
    );
  }
  if (to) {
    return (
      <Link
        to={to}
        //@ts-ignore
        exact={exact}
        className={`button button--${size} ${
          inverse ? 'button--inverse' : ''
        } ${danger ? 'button--danger' : ''}`}
      >
        {children}
      </Link>
    );
  }
  return (
    <button
      className={`button button--${size} ${inverse ? 'button--inverse' : ''} ${
        danger ? 'button--danger' : ''
      }`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
