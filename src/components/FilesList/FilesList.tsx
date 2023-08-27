import { useSelector, useDispatch } from 'react-redux';
import { IFile } from '../../modules/types/mainProjects';
import { File } from '../File/File';
import { useState } from 'react';
import { LoadingSpinner } from '../UIElements/LoadingSpinner';
import { getIsFilesLoading } from '../../modules/selectors/loading';
import { Button } from '../FormElement/Button';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { setIsDragging } from '../../modules/actions/dragging';
import { reorder } from '../../utils/utils';

import './FilesList.scss';

interface IProps {
  files: IFile[];
  saveFilesOrder: (order: IFile[]) => void;
  handleOpenModal: (id: string) => void;
}

export const FilesList = ({
  files,
  saveFilesOrder,
  handleOpenModal,
}: IProps) => {
  const isLoading = useSelector(getIsFilesLoading);
  const [showAllFiles, setShowAllFiles] = useState(false);
  const dispatch = useDispatch();

  const filesToShow = showAllFiles ? files : files ? files.slice(0, 20) : [];

  const toggleShowAllFiles = () => {
    setShowAllFiles(!showAllFiles);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const copiedFiles = [...files];

    const newOrder = reorder(
      copiedFiles,
      result.source.index,
      result.destination.index,
    );

    saveFilesOrder(newOrder);
    dispatch(setIsDragging(false));
  };

  return (
    <>
      <DragDropContext
        onDragEnd={onDragEnd}
        onDragStart={() => dispatch(setIsDragging(true))}
      >
        <Droppable droppableId='droppable'>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {filesToShow &&
                filesToShow.map((file: IFile, index: number) => (
                  <File
                    key={file.id}
                    name={file.name}
                    url={file.url}
                    id={file.id}
                    onDelete={handleOpenModal}
                    index={index}
                  />
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {files.length > 20 && (
        <Button onClick={toggleShowAllFiles} customClassName='files-list__btn'>
          {showAllFiles ? 'Показати менше' : 'Показати більше'}
        </Button>
      )}
      {isLoading && (
        <div className='center'>
          <LoadingSpinner blue />
        </div>
      )}
    </>
  );
};
