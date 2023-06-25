import { useCallback } from 'react';
import { debounce } from '../utils/debounce';

export const useDebounce = () => {
  const saveChanges = useCallback(
    debounce((callback: () => void) => {
      callback();
    }, 1000),
    []
  );

  return { saveChanges };
};
