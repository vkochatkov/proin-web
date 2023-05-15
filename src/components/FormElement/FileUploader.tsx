import React, { useRef, FC } from 'react';
import { Button } from './Button';

import './FileUploader.scss';

type FileUploaderProps = {
  id: string;
  allowedTypes?: string;
  multiple?: boolean;
  pickedHandler: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  buttonLabel: string;
  className?: string;
};

export const FileUploader: FC<FileUploaderProps> = ({
  id,
  allowedTypes = '*',
  multiple,
  pickedHandler,
  buttonLabel,
  className,
}) => {
  const filePickerRef = useRef<HTMLInputElement>(null);

  const pickImageHandler = () => {
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
      <Button type="button" onClick={pickImageHandler}>
        {buttonLabel}
      </Button>
    </div>
  );
};
