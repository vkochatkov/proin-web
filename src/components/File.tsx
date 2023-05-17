import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Link,
  MenuItem,
  Menu,
} from '@mui/material';
import { useContextMenu } from '../hooks/useContextMenu';

interface IProps {
  name: string;
  url: string;
  id: string;
  onDelete: (id: string) => void;
  index: number;
}

export const File: React.FC<IProps> = ({ name, url, id, onDelete, index }) => {
  const isImage = /\.(jpg|jpeg|png|gif)$/i.test(name);
  const extension = '.' + (name?.split('.')?.pop() ?? '');
  const { longPressProps, handleClose, contextMenuPosition, anchorEl } =
    useContextMenu();

  const displayName = name.substring(0, name.length - extension.length);

  const handleDownload = () => {
    window.open(url, '_blank');
  };

  return (
    <Draggable draggableId={id} index={index} key={id}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...longPressProps}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card
            sx={{
              minWidth: '100%',
              marginTop: '10px',
              '&:hover': {
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
              },
            }}
          >
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
                  onDelete(id);
                  handleClose();
                }}
              >
                Видалити
              </MenuItem>
            </Menu>
            <Link
              onClick={handleDownload}
              style={{
                textDecoration: 'none',
                color: '#000',
              }}
            >
              {isImage ? (
                <CardMedia
                  component="img"
                  image={url}
                  height="140"
                  title={name}
                />
              ) : (
                <CardMedia
                  component="div"
                  sx={{ backgroundColor: 'grey.300', height: '140px' }}
                >
                  <Typography
                    variant="h6"
                    component="h2"
                    align="center"
                    sx={{ paddingTop: '60px' }}
                  >
                    {extension.replace('.', '')}
                  </Typography>
                </CardMedia>
              )}
              <CardContent
                sx={{
                  display: 'flex',
                  padding: '5px',
                  paddingBottom: '5px !important',
                }}
              >
                <Typography
                  gutterBottom
                  variant="h5"
                  component="h2"
                  noWrap
                  style={{ fontSize: '14px', fontWeight: 600 }}
                >
                  {displayName}
                </Typography>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '14px',
                    fontWeight: 600,
                  }}
                >
                  {extension}
                </span>
              </CardContent>
            </Link>
          </Card>
        </div>
      )}
    </Draggable>
  );
};
