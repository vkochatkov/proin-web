import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { IFile } from '../../modules/types/mainProjects';
import { LoadingSpinner } from '../UIElements/LoadingSpinner';
import { getIsFilesLoading } from '../../modules/selectors/loading';
import { Button } from '../FormElement/Button';
import { Gallery } from 'react-photoswipe-gallery';
import { File } from '../File/File';
import Grid from '../Grid';
import {
  DndContext,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import SortableFile from '../SortableFile';
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

import './FilesList.scss';

interface IProps {
  files: IFile[];
  draggingMode?: boolean;
  saveFilesOrder: (order: IFile[]) => void;
  handleOpenModal: (id: string) => void;
}

export const FilesList = ({
  files,
  handleOpenModal,
  draggingMode = false,
  saveFilesOrder,
}: IProps) => {
  const isLoading = useSelector(getIsFilesLoading);
  const [showAllFiles, setShowAllFiles] = useState(false);
  const filesToShow = showAllFiles ? files : files ? files.slice(0, 20) : [];
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (active.id !== over?.id) {
        const filesIds = files.map((file) => file.id);
        const oldIndex = filesIds.indexOf(active.id as string);
        const newIndex = filesIds.indexOf(over!.id as string);

        const newOrder = arrayMove(files, oldIndex, newIndex);

        saveFilesOrder(newOrder);
      }
    },
    [files],
  );

  const toggleShowAllFiles = () => {
    setShowAllFiles(!showAllFiles);
  };

  return (
    <>
      {draggingMode ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={files} strategy={rectSortingStrategy}>
            <Grid>
              {filesToShow &&
                filesToShow.map((file, index) => (
                  <SortableFile
                    key={file.id}
                    name={file.name}
                    url={file.url}
                    id={file.id}
                    width={file.width ? file.width : 1024}
                    height={file.height ? file.height : 768}
                    onDelete={handleOpenModal}
                  />
                ))}
            </Grid>
          </SortableContext>
        </DndContext>
      ) : (
        <Gallery>
          <Grid>
            {filesToShow &&
              filesToShow.map((file, index) => (
                <File
                  key={file.id}
                  name={file.name}
                  url={file.url}
                  id={file.id}
                  width={file.width ? file.width : 1024}
                  height={file.height ? file.height : 768}
                  onDelete={handleOpenModal}
                />
              ))}
          </Grid>
        </Gallery>
      )}
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
