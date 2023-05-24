import React, { useEffect, useState } from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import { Button as CloseButton } from '../FormElement/Button';
import FormControl from '@mui/joy/FormControl';
import Textarea from '@mui/joy/Textarea';

import './ComponentInput.scss';

interface Props {
  onClick: (value: string) => void;
  onCancel?: () => void;
  isActive?: boolean;
  text?: string;
  placeholder: string;
  isActiveWithoutText?: boolean;
  buttonLabel: string;
}

export const DynamicInput = (props: Props) => {
  const [value, setValue] = useState<string | undefined>(
    props.isActive && props.text ? props.text : ''
  );
  const [isTextareaActive, setIsTextareaActive] = useState<boolean>(
    props.isActive ? props.isActive : false
  );

  useEffect(() => {
    if ((props.isActive && props.text) || props.isActiveWithoutText) {
      setIsTextareaActive(true);
      setValue(props.text);
    } else {
      setIsTextareaActive(false);
      setValue('');
    }
  }, [props.isActive, props.text]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValue(event.target.value);
  };

  const handleClick = () => {
    if (!value) return;

    props.onClick(value);
    setIsTextareaActive(false);
    setValue('');
  };

  return (
    <FormControl>
      <Textarea
        placeholder={props.placeholder}
        minRows={props.isActiveWithoutText ? 1 : !isTextareaActive ? 1 : 3}
        value={value}
        onFocus={() => {
          setIsTextareaActive(true);
        }}
        onBlur={
          !value && !props.isActiveWithoutText
            ? () => setIsTextareaActive(false)
            : undefined
        }
        onChange={handleChange}
        endDecorator={
          isTextareaActive ? (
            <Box
              sx={{
                display: 'flex',
                gap: 'var(--Textarea-paddingBlock)',
                pt: 'var(--Textarea-paddingBlock)',
                borderTop: props.isActiveWithoutText ? '' : '1px solid',
                flex: 'auto',
                justifyContent: 'flex-end',
              }}
            >
              <CloseButton
                customClassName="comment-input__close-btn"
                onClick={props.onCancel}
              >
                <img
                  src="/close.svg"
                  alt="close_logo"
                  className="comment-input__close-icon"
                />
              </CloseButton>
              <Button onClick={handleClick}>{props.buttonLabel}</Button>
            </Box>
          ) : null
        }
      />
    </FormControl>
  );
};
