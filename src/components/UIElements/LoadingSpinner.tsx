import React from 'react';

import './LoadingSpinner.scss';

interface LoadingSpinnerProps {
  asOverlay?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  asOverlay,
}) => {
  return (
    <div className={`${asOverlay && 'loading-spinner__overlay'}`}>
      <div className="lds-dual-ring"></div>
    </div>
  );
};
