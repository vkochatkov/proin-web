import React, { ReactNode } from 'react';

import './Card.scss';

interface CardProps {
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}

export const Card: React.FC<CardProps> = ({
  className = '',
  style = {},
  children,
}) => {
  return (
    <div className={`card ${className}`} style={style}>
      {children}
    </div>
  );
};
