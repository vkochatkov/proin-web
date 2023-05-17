import { useSelector } from 'react-redux';
import { getCurrentProject } from '../modules/selectors/mainProjects';
import { IFile } from '../modules/types/mainProjects';
import { File } from './File';
import { useState } from 'react';
import { LoadingSpinner } from './UIElements/LoadingSpinner';
import { getIsFilesLoading } from '../modules/selectors/loading';
import { Button } from './FormElement/Button';
import { useDispatch } from 'react-redux';
import { removeFile, updateFilesOrder } from '../modules/actions/mainProjects';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { setIsDragging } from '../modules/actions/dragging';
import { useParams } from 'react-router-dom';

import './FilesList.scss';

const reorder = (list: File[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const FilesList = () => {
  const currentProject = useSelector(getCurrentProject);
  const isLoading = useSelector(getIsFilesLoading);
  const [showAllFiles, setShowAllFiles] = useState(false);
  const dispatch = useDispatch();
  const { pid } = useParams();

  const handleDeleteFile = (id: string) => {
    dispatch(removeFile(id) as any);
  };

  const filesToShow = showAllFiles
    ? currentProject?.files
    : currentProject?.files
    ? currentProject?.files.slice(0, 4)
    : [];

  const toggleShowAllFiles = () => {
    setShowAllFiles(!showAllFiles);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    if (!pid) return;

    const files = [...currentProject?.files];

    const newOrder = reorder(
      files,
      result.source.index,
      result.destination.index
    );

    dispatch(updateFilesOrder(pid, newOrder) as any);
    dispatch(setIsDragging(false));
  };

  return (
    <>
      <DragDropContext
        onDragEnd={onDragEnd}
        onDragStart={() => dispatch(setIsDragging(true))}
      >
        <Droppable droppableId="droppable">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {filesToShow &&
                filesToShow.map((file: IFile, index: number) => (
                  <File
                    key={file.id}
                    name={file.name}
                    url={file.url}
                    id={file.id}
                    onDelete={handleDeleteFile}
                    index={index}
                  />
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {currentProject?.files && currentProject?.files.length > 4 && (
        <Button onClick={toggleShowAllFiles} customClassName="files-list__btn">
          {showAllFiles ? 'Показати менше' : 'Показати більше'}
        </Button>
      )}
      {isLoading && (
        <div className="center">
          <LoadingSpinner blue />
        </div>
      )}
    </>
  );
};
