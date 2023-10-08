import React, { forwardRef, useEffect, useState } from 'react';
import Button from '@mui/joy/Button';
import { Button as CloseButton } from '../FormElement/Button';
import FormControl from '@mui/joy/FormControl';
import TextareaAutosize from 'react-textarea-autosize';

import './DynamicInput.scss';

interface Props {
  onClick: (value: string) => void;
  onCancel: () => void;
  isActive?: boolean;
  text?: string;
  placeholder: string;
  isActiveWithoutText?: boolean;
  buttonLabel: string;
}

export const DynamicInput = forwardRef<HTMLTextAreaElement, Props>(
  (props, ref) => {
    const [value, setValue] = useState<string | undefined>(
      props.isActive && props.text ? props.text : '',
    );
    const [isTextareaActive, setIsTextareaActive] = useState<boolean>(
      props.isActive ? props.isActive : false,
    );

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

    return (
      <FormControl>
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
          <div
            style={{
              display: 'flex',
              gap: 'var(--Textarea-paddingBlock)',
              paddingTop: 'var(--Textarea-paddingBlock)',
              // borderTop: props.isActiveWithoutText ? '' : '1px solid',
              flex: 'auto',
              justifyContent: 'flex-end',
            }}
          >
            <CloseButton
              customClassName='comment-input__close-btn'
              onClick={() => {
                props.onCancel();
                setIsTextareaActive(false);
              }}
            >
              <img
                src='/close.svg'
                alt='close_logo'
                className='comment-input__close-icon'
              />
            </CloseButton>
            <Button onClick={handleSaveValue}>{props.buttonLabel}</Button>
          </div>
        ) : null}
      </FormControl>
    );
  },
);
