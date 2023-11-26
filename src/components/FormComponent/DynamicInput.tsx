import React, { forwardRef, useContext, useEffect, useState } from 'react';
import Button from '@mui/joy/Button';
import { Button as CustomButton } from '../FormElement/Button';
import FormControl from '@mui/joy/FormControl';
import TextareaAutosize from 'react-textarea-autosize';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import FilePickerRefContext from '../ContextProvider/FilesPickerRefProvider';
import { CommentImageUploader } from '../CommentImageUploader';

import './DynamicInput.scss';

interface Props {
  onClick: (value: string) => void;
  onCancel: () => void;
  isActive?: boolean;
  text?: string;
  placeholder: string;
  isActiveWithoutText?: boolean;
  buttonLabel: string;
  uploader?: boolean;
}

const formStyle = {
  '&.MuiFormControl-root': {
    borderRadius: '5px',
    backgroundColor: 'white',
    boxSizing: 'border-box',
    padding: '5px',
    border: '1px solid gray',
    '&:focus-within': {
      outline: '1px solid blue',
    },
    '& hr': {
      margin: '0 0 5px',
      opacity: '0.5',
    },
    '& textarea': {
      border: 'none',
      '&:focus-visible': {
        outline: 'none',
      },
    },
  },
};

export const DynamicInput = forwardRef<HTMLTextAreaElement, Props>(
  (props, ref) => {
    const [value, setValue] = useState<string | undefined>(
      props.isActive && props.text ? props.text : '',
    );
    const [isTextareaActive, setIsTextareaActive] = useState<boolean>(
      props.isActive ? props.isActive : false,
    );
    const filePickerRef = useContext(FilePickerRefContext);

    useEffect(() => {
      if (props.isActive || props.isActiveWithoutText) {
        setIsTextareaActive(true);
        if (ref && 'current' in ref) {
          ref.current?.focus();
        }

        if (props.text) {
          setValue(props.text);
        }
      } else {
        setIsTextareaActive(false);
        setValue('');
      }
    }, [props.isActive, props.text, props.isActiveWithoutText, ref]);

    const handleChange = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setValue(event.target.value);
    };

    const handleSaveValue = () => {
      if (!value) return;

      props.onClick(value);

      setIsTextareaActive(false);
      setValue('');
    };

    const handlePickImages = () => {
      // dispatch(openModal({ id: 'imageUploadModal' }));
      if (!filePickerRef) return;

      filePickerRef.current?.click();
    };

    return (
      <FormControl sx={formStyle}>
        <TextareaAutosize
          ref={ref}
          placeholder={props.placeholder}
          minRows={props.isActiveWithoutText ? 1 : !isTextareaActive ? 1 : 3}
          value={value}
          autoFocus={props.isActive}
          onFocus={() => {
            setIsTextareaActive(true);
          }}
          onChange={handleChange}
        />
        {isTextareaActive ? (
          <>
            <hr />
            <div className='dynamic-input__buttons-container'>
              <CustomButton
                customClassName='comment-input__close-btn'
                onClick={handlePickImages}
              >
                <InsertPhotoIcon />
              </CustomButton>
              <div className='dynamic-input__flex-end'>
                <CustomButton
                  customClassName='comment-input__close-btn'
                  onClick={() => {
                    props.onCancel();
                    setIsTextareaActive(false);
                    setValue('');
                  }}
                >
                  <img
                    src='/close.svg'
                    alt='close_logo'
                    className='comment-input__close-icon'
                  />
                </CustomButton>
                <Button onClick={handleSaveValue}>{props.buttonLabel}</Button>
              </div>
            </div>
            <CommentImageUploader />
          </>
        ) : null}
      </FormControl>
    );
  },
);
