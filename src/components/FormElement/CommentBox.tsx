import { Avatar } from '@mui/joy';
import { Paper, Grid, Button, Menu, MenuItem } from '@mui/material';
import { FC, useState } from 'react';

interface Props {
  text: string;
  name: string;
  timestamp: string;
  logoLink?: string;
  id: string;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export const CommentBox: FC<Props> = ({
  text,
  name,
  timestamp,
  logoLink = '',
  id,
  onDelete,
  onEdit,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const linkRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/g; // Regular expression to match links
  const parts = text.split(linkRegex);

  function getElapsedTime(timestamp: string): string {
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
  }

  const handleOpenContextMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Paper
        style={{ padding: '20px', marginTop: '1rem' }}
        onContextMenu={handleOpenContextMenu}
      >
        <Grid container wrap="nowrap" spacing={2}>
          <Grid item>
            <Avatar alt="Remy Sharp" src={logoLink} />
          </Grid>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <h4 style={{ margin: 0, textAlign: 'left' }}>{name}</h4>
            {parts.map((part, index) => {
              if (!part) return null;
              if (part.match(linkRegex)) {
                // If the part is a link
                return (
                  <a
                    style={{
                      color: '#0e86d4',
                    }}
                    key={index}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {part}
                  </a>
                );
              } else {
                // Otherwise, render regular text
                return (
                  <p key={index} style={{ textAlign: 'left', margin: '0' }}>
                    {part}
                  </p>
                );
              }
            })}
            <p style={{ textAlign: 'left', color: 'gray', marginBottom: '0' }}>
              {getElapsedTime(timestamp)}
            </p>
          </Grid>
        </Grid>
      </Paper>
      <Grid container alignItems="center" justifyContent="space-between">
        <div>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              left: '12rem',
            }}
          >
            <MenuItem onClick={() => onDelete(id)}>Видалити</MenuItem>
            <MenuItem onClick={() => onEdit(id)}>Редагувати</MenuItem>
          </Menu>
        </div>
      </Grid>
    </>
  );
};
