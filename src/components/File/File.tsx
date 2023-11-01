import { forwardRef, useState } from 'react';
import { CardMedia, Typography, Link, MenuItem, Menu } from '@mui/material';
import { useContextMenu } from '../../hooks/useContextMenu';
import { Button } from '../FormElement/Button';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { Skeleton } from '@mui/material';
import { Item } from 'react-photoswipe-gallery';

import 'photoswipe/dist/photoswipe.css';

import './File.scss';

interface IProps {
  name: string;
  url: string;
  id: string;
  onDelete: (id: string) => void;
  width: number;
  height: number;
  style?: { transform: string | undefined; transition: string | undefined };
  isDragging?: boolean;
  draggingMode?: boolean;
}

export const File = forwardRef<HTMLDivElement, IProps>(
  (
    {
      name,
      url,
      id,
      onDelete,
      width,
      height,
      isDragging,
      draggingMode = false,
      ...props
    },
    ref,
  ) => {
    const isImage = /\.(jpg|jpeg|png|gif)$/i.test(name);
    const extension = '.' + (name?.split('.')?.pop() ?? '');
    const { handleContextMenu, handleClose, contextMenuPosition, anchorEl } =
      useContextMenu();
    const [loaded, setLoaded] = useState(!isImage);
    const fileStyle = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
    };

    const emptyImageContainerStyle = {
      backgroundColor: 'grey.300',
      height: '100%',
      margin: '0 auto',
      width: '85%',
    };

    const handleDownload = () => {
      window.open(url, '_blank');
    };

    const draggingElement = () => (
      <>
        <div className='file' ref={ref} {...props}>
          {isImage ? (
            <>
              <Skeleton
                variant='rectangular'
                width='100%'
                height='100%'
                style={{
                  position: 'absolute',
                  display: loaded ? 'none' : 'block',
                }}
              />
              <Item
                original={url}
                thumbnail={url}
                width={width}
                height={height}
              >
                {({ ref, open }) => (
                  <img
                    //@ts-ignore
                    ref={ref}
                    onClick={open}
                    src={url}
                    alt={name}
                    onLoad={() => setLoaded(true)}
                  />
                )}
              </Item>
            </>
          ) : (
            <Link
              onClick={handleDownload}
              style={{
                textDecoration: 'none',
                color: '#000',
                width: '100%',
              }}
            >
              <CardMedia component='div' sx={emptyImageContainerStyle}>
                <Typography
                  variant='h6'
                  component='h2'
                  align='center'
                  sx={fileStyle}
                >
                  {extension.replace('.', '')}
                </Typography>
              </CardMedia>
            </Link>
          )}
        </div>
      </>
    );

    const commonElement = () => (
      <>
        <div className='file'>
          <>
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
          </>
          {isImage ? (
            <>
              <Skeleton
                variant='rectangular'
                width='100%'
                height='100%'
                style={{
                  position: 'absolute',
                  display: loaded ? 'none' : 'block',
                }}
              />
              <Item
                original={url}
                thumbnail={url}
                width={width}
                height={height}
              >
                {({ ref, open }) => (
                  <img
                    //@ts-ignore
                    ref={ref}
                    onClick={open}
                    src={url}
                    alt={name}
                    onLoad={() => setLoaded(true)}
                  />
                )}
              </Item>
            </>
          ) : (
            <Link
              onClick={handleDownload}
              style={{
                textDecoration: 'none',
                color: '#000',
                width: '100%',
              }}
            >
              <CardMedia component='div' sx={emptyImageContainerStyle}>
                <Typography
                  variant='h6'
                  component='h2'
                  align='center'
                  sx={fileStyle}
                >
                  {extension.replace('.', '')}
                </Typography>
              </CardMedia>
            </Link>
          )}
        </div>
      </>
    );

    return <>{draggingMode ? draggingElement() : commonElement()}</>;
  },
);
