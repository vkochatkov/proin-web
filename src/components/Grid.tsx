import React, { FC, ReactNode } from 'react';

type GridProps = {
  columns?: number;
  children: ReactNode;
};

const Grid: FC<GridProps> = ({ children, columns }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat( auto-fill, minmax(100px, 1fr) )`,
        gridGap: 10,
        margin: '10px auto',
      }}
    >
      {children}
    </div>
  );
};

export default Grid;
