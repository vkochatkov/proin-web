import { Avatar } from '@mui/joy';
import { Paper, Grid, Menu, MenuItem } from '@mui/material';
import { FC, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAuth } from '../../modules/selectors/user';
import { red, blue, green, yellow } from '@mui/material/colors';
import { ProjectTextOutput } from './ProjectTextOutput';
import { useLongPress } from 'react-use';

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [contextMenuPosition, setContextMenuPosition] = useState<{
    top: number;
    left: number;
  }>({ top: 0, left: 0 });
  const colorShade = 700;
  const colors = useMemo(
    () => [
      red[colorShade],
      blue[colorShade],
      green[colorShade],
      yellow[colorShade],
    ],
    [colorShade]
  );
  const firstLetter = name.charAt(0).toUpperCase();

  const backgroundColor = useMemo(() => {
    const index = firstLetter.charCodeAt(0) % colors.length;
    return colors[index];
  }, [colors, firstLetter]);

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

  const handleContextMenu = (event: any) => {
    event.preventDefault();

    const target = event.currentTarget || event.target;

    setAnchorEl(target);
    setContextMenuPosition({
      top: event.clientY || event.touches[0].clientY,
      left: event.clientX || event.touches[0].clientX,
    });
  };

  const defaultOptions = {
    isPreventDefault: false,
    delay: 300,
  };

  const longPressProps = useLongPress(handleContextMenu, {
    ...defaultOptions,
  });

  const handleClose = () => {
    setAnchorEl(null);
  };

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
                bgcolor: backgroundColor,
              }}
            >
              <h3
                style={{
                  color: '#fff',
                }}
              >
                {firstLetter}
              </h3>
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
              <MenuItem onClick={() => onDelete(id)}>Видалити</MenuItem>
              <MenuItem onClick={() => onEdit(id)}>Редагувати</MenuItem>
            </Menu>
          )}
        </div>
      </Grid>
    </>
  );
};
