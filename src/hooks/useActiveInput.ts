import { useState } from 'react';

export const useActiveInput = () => {
  const [isActive, setIsActive] = useState(false);

  const handleHideInput = (id: string, text: string) => {
    if (id === 'projectName' && !text) {
      return;
    }

    setIsActive(false);
  };

  return { isActive, setIsActive, handleHideInput };
};