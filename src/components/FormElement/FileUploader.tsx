import React, { FC, useContext } from 'react';
import FilePickerRefContext from '../ContextProvider/FilesPickerRefProvider';
import { Button } from './Button';

import './FileUploader.scss';

type FileUploaderProps = {
  id: string;
  allowedTypes?: string;
  multiple?: boolean;
  pickedHandler: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  buttonLabel: string;
  className?: string;
  isButtonHide?: boolean;
};

export const FileUploader: FC<FileUploaderProps> = ({
  id,
  allowedTypes = '*',
  multiple,
  pickedHandler,
  buttonLabel,
  className,
  isButtonHide = false,
}) => {
  const filePickerRef = useContext(FilePickerRefContext);

  const pickImageHandler = () => {
    if (!filePickerRef) return;

    filePickerRef.current?.click();
  };

  return (
    <div className={`form-control ${className ? className : ''}`}>
      <input
        id={id}
        ref={filePickerRef}
        style={{ display: 'none' }}
        type="file"
        accept={allowedTypes}
        onChange={pickedHandler}
        multiple={multiple ? multiple : false}
      />
      {!isButtonHide && (
        <Button type="button" onClick={pickImageHandler}>
          {buttonLabel}
        </Button>
      )}
    </div>
  );
};
