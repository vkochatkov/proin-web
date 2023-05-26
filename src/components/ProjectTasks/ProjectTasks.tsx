import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  changeTasksOrder,
  createTask,
} from '../../modules/actions/currentProjectTasks';
import { getTasks } from '../../modules/selectors/currentProjectTasks';
import { DynamicInput } from '../FormComponent/DynamicInput';
import { Button } from '../FormElement/Button';
import { ProjectTask } from '../ProjectTask';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { reorder } from '../../utils/utils';
import { setIsDragging } from '../../modules/actions/dragging';

import './ProjectTasks.scss';

export const ProjectTasks = () => {
  const tasks = useSelector(getTasks);
  const { pid } = useParams();
  const dispatch = useDispatch();
  const [isActiveInput, setIsActiveInput] = useState(false);

  const handleClick = () => {
    setIsActiveInput(true);
  };

  const handleCloseInput = () => {
    setIsActiveInput(false);
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
  };

  return (
    <div className="project-tasks">
      <div>
        <Button
          type="button"
          customClassName="project-tasks__btn"
          onClick={handleClick}
        >
          Додати задачу
        </Button>
      </div>
      {isActiveInput && (
        <div className="project-tasks__wrapper">
          <DynamicInput
            placeholder="Напишіть назву задачі"
            onClick={(value) => {
              handleCreateNewTask(value);
              setIsActiveInput(false);
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
                  <ProjectTask task={task} index={index} key={task.taskId} />
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
