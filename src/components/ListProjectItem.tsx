import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { useDispatch } from 'react-redux';
import { setIsDragging } from '../modules/actions/dragging';
import { reorder } from '../utils/utils';
import { ProjectItem } from './ProjectItem/ProjectItem';
import { Project } from '../modules/types/mainProjects';

interface Props {
  projects: Project[];
  onClick: (id: string) => void;
  updateOrder: (newItem: Project[], index?: string) => void;
  isWrapped?: boolean;
}

const getListStyle = (isDraggingOver: boolean, isWrapped: boolean) => ({
  backgroundColor: 'rgba(248, 248, 248, .8)',
  padding: isWrapped ? '0 5px' : 0,
  borderRadius: '5px',
  margin: '0 10px',
});

export const ListProjectItem: React.FC<Props> = ({
  projects,
  onClick,
  updateOrder,
  isWrapped = false,
}) => {
  const dispatch = useDispatch();

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const newItems = reorder(
      projects,
      result.source.index,
      result.destination.index,
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
        <Droppable droppableId='droppable'>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={
                projects && projects.length > 0
                  ? getListStyle(snapshot.isDraggingOver, isWrapped)
                  : undefined
              }
            >
              {projects &&
                projects.map((item: Project, index: number) => {
                  return (
                    <ProjectItem
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
