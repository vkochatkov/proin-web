import { FC, useMemo } from 'react';
import { Paper, Grid, Menu, MenuItem, Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import { getAuth } from '../modules/selectors/user';
import { ProjectTextOutput } from './FormComponent/ProjectTextOutput';
import { useContextMenu } from '../hooks/useContextMenu';
import { backgroundColor } from '../utils/avatar-view';

import './CommentBox.scss';

interface Props {
  text: string;
  name: string;
  timestamp: string;
  logoLink?: string;
  id: string;
  userId: string;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onReply: (name: string) => void;
}

export const CommentBox: FC<Props> = ({
  text,
  name,
  timestamp,
  logoLink = '',
  id,
  userId,
  onDelete,
  onEdit,
  onReply,
}) => {
  const auth = useSelector(getAuth);
  const isUserOwnComment = auth.userId === userId;
  const { longPressProps, handleClose, contextMenuPosition, anchorEl } =
    useContextMenu();

  const firstLetter = name.charAt(0).toUpperCase();

  const elapsedTime = useMemo(() => {
    const now = new Date();
    const posted = new Date(timestamp);
    const diffMs = now.getTime() - posted.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);

    if (diffMinutes < 1) {
      return 'posted 1 minute ago';
    } else if (diffMinutes < 60) {
      return `posted ${diffMinutes} minutes ago`;
    } else {
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) {
        return `posted ${diffHours} hours ago`;
      } else {
        const diffDays = Math.floor(diffHours / 24);
        return `posted ${diffDays} days ago`;
      }
    }
  }, [timestamp]);

  return (
    <>
      <Paper
        className="disable-text-selection"
        style={{ padding: '20px', marginTop: '1rem' }}
        {...longPressProps}
      >
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar
              alt="Remy Sharp"
              src={logoLink}
              sx={{
                bgcolor: () => backgroundColor(firstLetter),
                width: 40,
                height: 40,
              }}
            >
              {/* <h3
                style={{
                  color: '#fff',
                  fontSize: '20px',
                  display: 'flex',
                }}
              > */}
              {firstLetter}
              {/* </h3> */}
            </Avatar>
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <h4 style={{ margin: 0, textAlign: 'left' }}>{name}</h4>
            <ProjectTextOutput text={text} />
            <p style={{ textAlign: 'left', color: 'gray', marginBottom: '0' }}>
              {elapsedTime}
            </p>
          </Grid>
        </Grid>
      </Paper>
      <Grid container alignItems="center" justifyContent="space-between">
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
                  onReply(name);
                  handleClose();
                }}
              >
                Відповісти
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
            </Menu>
          )}
        </div>
      </Grid>
    </>
  );
};
