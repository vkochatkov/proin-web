import React, { FC, ReactNode } from 'react';
import './Header.scss';

interface Props {
  children: ReactNode;
}

export const Header: FC<Props> = ({ children }) => {
  return <header className="header">{children}</header>;
};
