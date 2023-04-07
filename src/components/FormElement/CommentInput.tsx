import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import Textarea from '@mui/joy/Textarea';

interface Props {
  onClick: (value: string) => void;
}

export const CommentInput = (props: Props) => {
  const [commentValue, setCommentValue] = React.useState<string>('');
  const [isTextareaActive, setIsTextareaActive] =
    React.useState<boolean>(false);

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
                borderColor: 'divider',
                flex: 'auto',
              }}
            >
              <Button sx={{ ml: 'auto' }} onClick={handleClick}>
                Зберегти
              </Button>
            </Box>
          ) : null
        }
        sx={{
          minWidth: 300,
        }}
      />
    </FormControl>
  );
};
