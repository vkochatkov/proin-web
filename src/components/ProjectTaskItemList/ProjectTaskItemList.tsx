import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ProjectTaskItem } from '../ProjectTaskItem/ProjectTaskItem';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { reorder } from '../../utils/utils';
import { setIsDragging } from '../../modules/actions/dragging';
import { clearInputState } from '../../modules/actions/input';
import { ITask } from '../../modules/types/projectTasks';

import './ProjectTaskItemList.scss';

interface IProps {
  tasks: ITask[];
  changeOrder: (tasks: ITask[]) => void;
  generateNavigationString: (id: string) => void;
}

export const ProjectTaskItemList = ({
  tasks,
  changeOrder,
  generateNavigationString,
}: IProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearInputState());
    };
  }, []);

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const newOrder = reorder(
      tasks,
      result.source.index,
      result.destination.index
    );

    changeOrder(newOrder);
    dispatch(setIsDragging(false));
  };

  return (
    <div className="project-tasks">
      <div>
        <DragDropContext
          onDragEnd={onDragEnd}
          onDragStart={() => dispatch(setIsDragging(true))}
        >
          <Droppable droppableId="droppable">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {tasks.map((task, index) => (
                  <ProjectTaskItem
                    task={task}
                    index={index}
                    key={task._id}
                    generateNavigationString={generateNavigationString}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};
