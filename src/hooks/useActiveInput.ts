import { useState } from 'react';

export const useActiveInput = () => {
  const [isActive, setIsActive] = useState(false);

  const handleHideInput = (id: string, text: string) => {
    if (
      (id === 'projectName' ||
        id === 'name' ||
        id === 'sum' ||
        id === 'classifier') &&
      !text
    ) {
      return;
    }

    setIsActive(false);
  };

  return { isActive, setIsActive, handleHideInput };
};
