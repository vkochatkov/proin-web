import React from 'react';
import { useSelector } from 'react-redux';
import { Draggable } from '@hello-pangea/dnd';
import { Menu, MenuItem } from '@mui/material';
import { Project } from '../../modules/reducers/mainProjects';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import { Card } from '../UIElements/Card';
import { getAuth } from '../../modules/selectors/user';
import { useActiveInput } from '../../hooks/useActiveInput';
import { useContextMenu } from '../../hooks/useContextMenu';
import { ProjectItemTextEditor } from '../FormComponent/ProjectItemTextEditor';
import { Button } from '../FormElement/Button';

import './ProjectItem.scss';

interface Props {
  name: string;
  logo?: string;
  description?: string;
  projectId: string;
  index: number;
  onClick: (projectId: string) => void;
  sharedWith: string[];
  id: string;
  project: Project;
}

export const ProjectItem: React.FC<Props> = ({
  name,
  logo,
  description,
  projectId,
  index,
  onClick,
  sharedWith,
  project,
  id,
}) => {
  const img = <img src={logo ? `${logo}` : ''} alt="logo" />;
  const { userId } = useSelector(getAuth);
  const {
    handleClose,
    contextMenuPosition,
    anchorEl,
    handleSelectProject,
    handleContextMenu,
  } = useContextMenu();
  const isMemberAdded = sharedWith
    ? Boolean(sharedWith.find((id) => id === userId))
    : false;
  const { isActive, setIsActive, handleHideInput } = useActiveInput();

  const handleClickMenuItem = (e: any, modal?: string) => {
    e.stopPropagation();

    if (modal) {
      handleSelectProject(projectId, modal);
    }

    handleClose();
  };

  return (
    <Draggable draggableId={projectId} index={index} key={projectId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          onClick={(e) => (!isActive ? onClick(projectId) : null)}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <Card className="item">
            <div className="item__first-block">
              {!logo && <div className="item__image-empty" />}
              {logo && img}
              <div className="item__text-container">
                <ProjectItemTextEditor
                  onBlur={handleHideInput}
                  isActive={isActive}
                  project={project}
                  id={id}
                  name={name}
                />
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
                    onClick={(e) => e.stopPropagation()}
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
                        handleClickMenuItem(e);
                        setIsActive(true);
                      }}
                    >
                      Редагувати
                    </MenuItem>
                    <MenuItem
                      onClick={(e) => handleClickMenuItem(e, 'move-project')}
                    >
                      Перемістити
                    </MenuItem>
                    <MenuItem
                      disabled={isMemberAdded}
                      onClick={(e) => handleClickMenuItem(e, 'remove-project')}
                    >
                      Видалити
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
