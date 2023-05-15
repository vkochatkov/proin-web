import React from 'react';

import './LoadingSpinner.scss';

interface LoadingSpinnerProps {
  asOverlay?: boolean;
  blue?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  asOverlay,
  blue,
}) => {
  return (
    <div className={`${asOverlay ? 'loading-spinner__overlay' : ''}`}>
      <div className={`lds-dual-ring ${blue ? 'blue' : ''}`}></div>
    </div>
  );
};
