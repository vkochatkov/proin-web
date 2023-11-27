import React, { forwardRef, useContext, useEffect, useState } from 'react';
import Button from '@mui/joy/Button';
import { Button as CustomButton } from '../FormElement/Button';
import FormControl from '@mui/joy/FormControl';
import TextareaAutosize from 'react-textarea-autosize';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import FilePickerRefContext from '../ContextProvider/FilesPickerRefProvider';
import { CommentImageUploader } from '../CommentImageUploader';
import { useForm } from '../../hooks/useForm';
import CloseIcon from '@mui/icons-material/Close';

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
    const { formState, inputHandler } = useForm(
      {
        comment: {
          value: props.isActive && props.text ? props.text : '',
          isValid: false,
        },
      },
      false,
    );
    const inputId = 'comment';
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
          inputHandler(inputId, props.text, true);
        }
      } else {
        setIsTextareaActive(false);
        inputHandler(inputId, '', true);
      }
    }, [props.isActive, props.text, props.isActiveWithoutText, ref]);

    const handleChange = (
      event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      inputHandler(inputId, event.target.value, true);
    };

    const handleSaveValue = () => {
      const value = formState.inputs[inputId]
        ? formState.inputs[inputId].value
        : '';
      if (!value) return;

      props.onClick(value);
      setIsTextareaActive(false);
      inputHandler(inputId, '', true);
    };

    const handleCloseInput = () => {
      props.onCancel();
      setIsTextareaActive(false);
      inputHandler(inputId, '', true);
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
          value={
            formState.inputs[inputId] && formState.inputs[inputId].value
              ? formState.inputs[inputId].value
              : ''
          }
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
                  onClick={handleCloseInput}
                >
                  <CloseIcon />
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
