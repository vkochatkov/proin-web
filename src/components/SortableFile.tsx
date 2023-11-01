import React, { FC } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ISortableFile } from '../modules/types/mainProjects';
import { File } from './File/File';

interface IProps extends ISortableFile {
  onDelete: (id: string) => void;
}

const SortableFile: FC<IProps> = (props) => {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    zIndex: isDragging ? '2' : '1',
  };

  return (
    <File
      ref={setNodeRef}
      style={style}
      isDragging={isDragging}
      draggingMode
      {...props}
      {...attributes}
      {...listeners}
    />
  );
};

export default SortableFile;
