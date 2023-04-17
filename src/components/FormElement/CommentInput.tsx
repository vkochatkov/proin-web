import React, { useState } from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import { Button as CloseButton } from './Button';
import FormControl from '@mui/joy/FormControl';
import Textarea from '@mui/joy/Textarea';

import './ComponentInput.scss';

interface Props {
  onClick: (value: string) => void;
  onCancel?: () => void;
  isActive?: boolean;
  text?: string;
}

export const CommentInput = (props: Props) => {
  const [commentValue, setCommentValue] = useState<string>(
    props.isActive && props.text ? props.text : ''
  );
  const [isTextareaActive, setIsTextareaActive] = useState<boolean>(
    props.isActive ? props.isActive : false
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCommentValue(event.target.value);
  };

  const handleClick = () => {
    props.onClick(commentValue);
    setIsTextareaActive(false);
    setCommentValue('');
  };

  return (
    <FormControl>
      <Textarea
        placeholder="Напишіть коментар"
        minRows={!isTextareaActive ? 1 : 3}
        value={commentValue}
        onFocus={() => {
          setIsTextareaActive(true);
        }}
        onBlur={!commentValue ? () => setIsTextareaActive(false) : undefined}
        onChange={handleChange}
        endDecorator={
          isTextareaActive ? (
            <Box
              sx={{
                display: 'flex',
                gap: 'var(--Textarea-paddingBlock)',
                pt: 'var(--Textarea-paddingBlock)',
                borderTop: '1px solid',
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
              <Button onClick={handleClick}>Зберегти</Button>
            </Box>
          ) : null
        }
      />
    </FormControl>
  );
};
