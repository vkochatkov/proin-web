import React, { createContext, ReactNode, useRef } from 'react';

const FilePickerRefContext =
  createContext<React.RefObject<HTMLInputElement> | null>(null);

interface IProps {
  children: ReactNode;
}

export const FilePickerRefProvider: React.FC<IProps> = ({ children }) => {
  const filePickerRef = useRef<HTMLInputElement>(null);

  return (
    // Provide the filePickerRef through the context
    <FilePickerRefContext.Provider value={filePickerRef}>
      {children}
    </FilePickerRefContext.Provider>
  );
};

export default FilePickerRefContext;
