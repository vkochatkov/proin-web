import React, { forwardRef, useContext, useEffect, useState } from 'react';
import Button from '@mui/joy/Button';
import { Button as CustomButton } from '../FormElement/Button';
import FormControl from '@mui/joy/FormControl';
import TextareaAutosize from 'react-textarea-autosize';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import FilePickerRefContext from '../ContextProvider/FilesPickerRefProvider';
import { CommentImageUploader } from '../CommentImageUploader';
import CloseIcon from '@mui/icons-material/Close';
import { FilesContext } from '../FilesContextProvider';

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
  isImageUploadDisable?: boolean;
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
    const context = useContext(FilesContext);
    const {
      inputValue = props.isActive && props.text ? props.text : '',
      setInputValue = () => {},
    } = context || {};

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
          setInputValue(props.text);
        }
      } else {
        setIsTextareaActive(false);
        setInputValue('');
      }
    }, [props.isActive, props.text, props.isActiveWithoutText, ref]);

    const handleChange = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setInputValue(event.target.value);
    };

    const handleSaveValue = () => {
      if (!inputValue) return;

      props.onClick(inputValue);
      setIsTextareaActive(false);
      setInputValue('');
    };

    const handleCloseInput = () => {
      props.onCancel();
      setIsTextareaActive(false);
      setInputValue('');
    };

    const handlePickImages = () => {
      if (!filePickerRef) return;

      filePickerRef.current?.click();
    };

    return (
      <FormControl sx={formStyle}>
        <TextareaAutosize
          ref={ref}
          placeholder={props.placeholder}
          minRows={props.isActiveWithoutText ? 1 : !isTextareaActive ? 1 : 3}
          value={inputValue}
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
              {!props.isImageUploadDisable && (
                <CustomButton
                  customClassName='comment-input__close-btn'
                  onClick={handlePickImages}
                >
                  <InsertPhotoIcon />
                </CustomButton>
              )}
              <div className='dynamic-input__flex-end'>
                <CustomButton
                  customClassName='comment-input__close-btn'
                  onClick={handleCloseInput}
                >
                  <CloseIcon />
                </CustomButton>
                <Button onClick={handleSaveValue}>{props.buttonLabel}</Button>
              </div>
            </div>
            <CommentImageUploader setIsTextareaActive={setIsTextareaActive} />
          </>
        ) : null}
      </FormControl>
    );
  },
);
