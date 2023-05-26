import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useDispatch } from 'react-redux';
import { setIsDragging } from '../modules/actions/dragging';
import { Project } from '../modules/reducers/mainProjects';
import { reorder } from '../utils/utils';
import { Item } from './Item/Item';

interface Props {
  projects: Project[];
  onClick: (id: string) => void;
  updateOrder: (newItem: Project[], index?: string) => void;
  isWrapped?: boolean;
}

const getListStyle = (isDraggingOver: boolean, isWrapped: boolean) => ({
  backgroundColor: 'rgba(248, 248, 248, .8)',
  padding: isWrapped ? 8 : 0,
  borderRadius: '5px',
});

export const ListItems = ({
  projects,
  onClick,
  updateOrder,
  isWrapped = false,
}: Props) => {
  const dispatch = useDispatch();

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      projects,
      result.source.index,
      result.destination.index
    );

    updateOrder(newItems, result.destination.index);
    dispatch(setIsDragging(false));
  };

  return (
    <>
      <DragDropContext
        onDragEnd={onDragEnd}
        onDragStart={() => dispatch(setIsDragging(true))}
      >
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={
                projects.length > 0
                  ? getListStyle(snapshot.isDraggingOver, isWrapped)
                  : undefined
              }
            >
              {projects.map((item: Project, index: number) => {
                return (
                  <Item
                    key={item._id}
                    projectId={item._id}
                    name={item.projectName ? item.projectName : ''}
                    logo={item.logoUrl}
                    description={item.description}
                    index={index}
                    onClick={onClick}
                    sharedWith={item.sharedWith}
                    id={item._id}
                    project={item}
                  />
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};
