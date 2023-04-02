import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Project } from '../modules/reducers/mainProjects';
import {
  editCurrentProject,
  updateProjects,
} from '../modules/actions/mainProjects';
import { getAuth } from '../modules/selectors/user';
import { useNavigate } from 'react-router-dom';
import { startLoading } from '../modules/actions/loading';
import { Item } from './Item';

interface Props {
  projects: Project[];
}

// a little function to help with reordering the result
const reorder = (list: Project[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'lightblue' : '#fff',
  padding: 8,
  borderRadius: '5px',
  minHeight: '85vh',
});

export const ListItems = ({ projects }: Props) => {
  const dispatch = useDispatch();
  const { token } = useSelector(getAuth);
  const navigate = useNavigate();

  const handleClick = (id: string) => {
    dispatch(startLoading());
    dispatch(editCurrentProject(token, id) as any);
    navigate(`/project-edit/${id}`);
  };

  const onDragEnd = (result: any) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const newItems: Project[] = reorder(
      projects,
      result.source.index,
      result.destination.index
    );

    dispatch(updateProjects(newItems));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            style={
              projects.length > 0
                ? getListStyle(snapshot.isDraggingOver)
                : undefined
            }
          >
            {projects.map((item: any, index: number) => {
              return (
                <Item
                  key={item._id}
                  projectId={item._id}
                  name={item.projectName}
                  logo={item.logoUrl}
                  description={item.description}
                  index={index}
                  onClick={handleClick}
                />
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
