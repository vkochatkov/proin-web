import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  changeTasksOrder,
  createTask,
} from '../../modules/actions/currentProjectTasks';
import { getTasks } from '../../modules/selectors/currentProjectTasks';
import { DynamicInput } from '../FormComponent/DynamicInput';
import { ProjectTaskItem } from '../ProjectTaskItem/ProjectTaskItem';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { reorder } from '../../utils/utils';
import { setIsDragging } from '../../modules/actions/dragging';
import { clearInputState, setIsActiveInput } from '../../modules/actions/input';
import { getIsActiveInputStatus } from '../../modules/selectors/input';

import './ProjectTaskItemList.scss';

export const ProjectTaskItemList = () => {
  const tasks = useSelector(getTasks);
  const { pid } = useParams();
  const dispatch = useDispatch();
  const isActiveInput = useSelector(getIsActiveInputStatus);

  useEffect(() => {
    return () => {
      dispatch(clearInputState());
    };
  }, []);

  const handleCloseInput = () => {
    dispatch(setIsActiveInput(false));
  };

  const handleCreateNewTask = (value: string) => {
    if (!pid) return;

    dispatch(createTask({ projectId: pid, name: value }) as any);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    if (!pid) return;

    const newOrder = reorder(
      tasks,
      result.source.index,
      result.destination.index
    );

    dispatch(changeTasksOrder(pid, newOrder) as any);
    dispatch(setIsDragging(false));
  };

  return (
    <div className="project-tasks">
      {isActiveInput && (
        <div className="project-tasks__wrapper">
          <DynamicInput
            placeholder="Напишіть назву задачі"
            onClick={(value) => {
              handleCreateNewTask(value);
              dispatch(setIsActiveInput(false));
            }}
            onCancel={handleCloseInput}
            isActiveWithoutText={true}
            buttonLabel={'Створити'}
          />
        </div>
      )}

      <div>
        <DragDropContext
          onDragEnd={onDragEnd}
          onDragStart={() => dispatch(setIsDragging(true))}
        >
          <Droppable droppableId="droppable">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {tasks.map((task, index) => (
                  <ProjectTaskItem task={task} index={index} key={task._id} />
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
