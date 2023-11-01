import { useState } from 'react';

export const useDraggingMode = () => {
  const [draggingMode, setDraggingMode] = useState<boolean>(false);

  const handleChangeDraggingMode = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setDraggingMode(event.target.checked);
  };

  return {
    draggingMode,
    setDraggingMode,
    handleChangeDraggingMode,
  };
};
