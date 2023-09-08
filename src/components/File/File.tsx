import React, { useState } from 'react';
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
import { useContextMenu } from '../../hooks/useContextMenu';
import { Button } from '../FormElement/Button';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { Skeleton } from '@mui/material';

import './File.scss';

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
  const { handleContextMenu, handleClose, contextMenuPosition, anchorEl } =
    useContextMenu();
  const [loaded, setLoaded] = useState(false);
  const displayName = name.substring(0, name.length - extension.length);
  const cardStyle = {
    position: 'relative',
    marginTop: `${index === 0 ? 0 : 15}px `,
    '&:hover': {
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
    },
  };
  const imageContainerStyle = { width: '85%', margin: '5px auto 0' };
  const emptyImageContainerStyle = {
    backgroundColor: 'grey.300',
    height: '140px',
    margin: '5px auto',
    width: '85%',
  };
  const cardContentStyle = {
    display: 'flex',
    padding: '5px',
    paddingBottom: '5px !important',
    alignItems: 'center',
  };

  const handleDownload = () => {
    window.open(url, '_blank');
  };

  return (
    <Draggable draggableId={id} index={index} key={id}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card sx={cardStyle}>
            <Button
              icon
              transparent
              customClassName='file__btn'
              onClick={handleContextMenu}
            >
              <MoreVertIcon className='file__icon' />
            </Button>
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
                <>
                  <CardMedia
                    component='img'
                    image={url}
                    height='140'
                    title={name}
                    sx={imageContainerStyle}
                    onLoad={() => {
                      setLoaded(true);
                    }}
                    style={{ display: loaded ? 'block' : 'none' }}
                  />
                  <Skeleton
                    variant='rectangular'
                    width='100%'
                    height={140}
                    style={{ display: loaded ? 'none' : 'block' }}
                  />
                </>
              ) : (
                <CardMedia component='div' sx={emptyImageContainerStyle}>
                  <Typography
                    variant='h6'
                    component='h2'
                    align='center'
                    sx={{ paddingTop: '60px' }}
                  >
                    {extension.replace('.', '')}
                  </Typography>
                </CardMedia>
              )}
              <CardContent sx={cardContentStyle}>
                <Typography
                  gutterBottom
                  variant='h5'
                  component='h2'
                  noWrap
                  style={{ fontSize: '14px', fontWeight: 600, margin: '0' }}
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
