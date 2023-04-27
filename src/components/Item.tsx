import React from 'react';
import { Card } from './UIElements/Card';
import { Draggable } from '@hello-pangea/dnd';
import { Menu, MenuItem } from '@mui/material';
import { useContextMenu } from '../hooks/useContextMenu';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { Button } from './FormElement/Button';

import './Item.scss';

interface Props {
  name?: string;
  logo?: string;
  description?: string;
  projectId: string;
  index: number;
  onClick: (projectId: string) => void;
}

export const Item: React.FC<Props> = ({
  name,
  logo,
  description,
  projectId,
  index,
  onClick,
}) => {
  const img = <img src={logo ? `${logo}` : ''} alt="logo" />;
  const {
    handleClose,
    contextMenuPosition,
    anchorEl,
    handleSelectProject,
    handleContextMenu,
  } = useContextMenu();

  return (
    <Draggable draggableId={projectId} index={index} key={projectId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          onClick={() => onClick(projectId)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className="item">
            <div className="item__first-block">
              {!logo && <div className="item__image-empty" />}
              {logo && img}
              <div className="item__text-container">
                <p className="item__name">{name}</p>
                <p className="item__description">{description}</p>
              </div>
            </div>
            <div className="item__button">
              <div className="item__icon-container">
                <Button
                  transparent
                  customClassName="item__btn"
                  onClick={handleContextMenu}
                >
                  <MoreVertIcon className="item__icon" />
                </Button>
              </div>
              {contextMenuPosition && (
                <div>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={(e: any) => {
                      e.stopPropagation();
                      handleClose();
                    }}
                    anchorPosition={{
                      top: contextMenuPosition.top,
                      left: contextMenuPosition.left,
                    }}
                  >
                    <MenuItem
                      onClick={(e) => {
                        handleSelectProject(projectId);
                        e.stopPropagation();
                        handleClose();
                      }}
                    >
                      Перемістити
                    </MenuItem>
                  </Menu>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </Draggable>
  );
};
