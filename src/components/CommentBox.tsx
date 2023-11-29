import { FC, useMemo } from 'react';
import { Paper, Grid, Menu, MenuItem, Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import { getAuth } from '../modules/selectors/user';
import { ProjectTextOutput } from './FormComponent/ProjectTextOutput';
import { useContextMenu } from '../hooks/useContextMenu';
import { backgroundColor } from '../utils/avatar-view';
import { getFirstLetter } from '../utils/utils';
import { ReplyCommentComponent } from './ReplyCommentComponent';
import { IFile } from '../modules/types/mainProjects';
import { Gallery } from 'react-photoswipe-gallery';
import { CommentImages } from './CommentImages';

import './CommentBox.scss';

interface Props {
  text: string;
  name: string;
  files: IFile[];
  timestamp: string;
  logoLink?: string;
  id: string;
  userId: string;
  parentCommentId?: string;
  replyUser?: string;
  replyUserCommentText?: string;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onReply: (id: string, name?: string) => void;
  onCopy: (textToCopy: string) => void;
}

export const CommentBox: FC<Props> = ({
  text,
  files,
  name,
  timestamp,
  logoLink = '',
  id,
  userId,
  parentCommentId,
  replyUser,
  replyUserCommentText,
  onDelete,
  onEdit,
  onReply,
  onCopy,
}) => {
  const auth = useSelector(getAuth);
  const isUserOwnComment = auth.userId === userId;
  const { longPressProps, handleClose, contextMenuPosition, anchorEl } =
    useContextMenu();
  const firstLetter = getFirstLetter(name);

  console.log({ files });

  const elapsedTime: string = useMemo(() => {
    const posted = new Date(timestamp);

    return posted.toLocaleDateString('uk-UA', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
  }, [timestamp]);

  return (
    <>
      <Paper
        className='disable-text-selection'
        style={{ padding: '20px', marginTop: '1rem' }}
        {...longPressProps}
        id={`comment-${id}`}
      >
        <Grid container wrap='nowrap' direction='column'>
          {parentCommentId && (
            <ReplyCommentComponent
              parentCommentId={parentCommentId}
              replyUser={replyUser}
              replyUserCommentText={replyUserCommentText}
            />
          )}
          <Gallery>
            {files && files.map((image) => <CommentImages image={image} />)}
          </Gallery>
          {files && files.length > 0 && <br />}
          <Grid
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Grid container direction='row' alignItems='center'>
              <Avatar
                alt='user_logo'
                src={logoLink}
                sx={{
                  bgcolor: () => backgroundColor(firstLetter),
                  width: 20,
                  height: 20,
                  fontSize: 14,
                }}
              >
                {firstLetter}
              </Avatar>
              <h4 style={{ margin: '0 0 0 10px' }}>{name}</h4>
            </Grid>
            <p style={{ color: 'gray', margin: '0' }}>{elapsedTime}</p>
          </Grid>
          <ProjectTextOutput text={text} />
        </Grid>
      </Paper>
      <Grid container alignItems='center' justifyContent='space-between'>
        <div>
          {!isUserOwnComment && (
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorPosition={{
                top: contextMenuPosition.top,
                left: contextMenuPosition.left,
              }}
            >
              <MenuItem
                onClick={() => {
                  onReply(id, name);
                  handleClose();
                }}
              >
                Відповісти
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onCopy(text);
                  handleClose();
                }}
              >
                Копіювати
              </MenuItem>
            </Menu>
          )}
          {isUserOwnComment && (
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorPosition={{
                top: contextMenuPosition.top,
                left: contextMenuPosition.left,
              }}
            >
              <MenuItem onClick={() => onEdit(id)}>Редагувати</MenuItem>
              <MenuItem onClick={() => onDelete(id)}>Видалити</MenuItem>
              <MenuItem
                onClick={() => {
                  onCopy(text);
                  handleClose();
                }}
              >
                Копіювати
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onReply(id);
                  handleClose();
                }}
              >
                Відповісти
              </MenuItem>
            </Menu>
          )}
        </div>
      </Grid>
    </>
  );
};
