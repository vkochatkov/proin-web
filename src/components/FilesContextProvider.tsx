import { Dispatch, ReactNode, SetStateAction, createContext } from 'react';

interface IContextProps {
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
  generateDataUrl: (files: File[]) => Promise<unknown[]>;
  onSubmit: (value: string) => void;
}

interface IProps extends IContextProps {
  children: ReactNode;
}

export const FilesContext = createContext<IContextProps | null>(null);

export const FilesContextProvider: React.FC<IProps> = ({
  children,
  ...props
}) => {
  return (
    <FilesContext.Provider value={props}>{children}</FilesContext.Provider>
  );
};
