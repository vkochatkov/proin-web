import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createTask } from '../../modules/actions/currentProjectTasks';
import { getTasks } from '../../modules/selectors/currentProjectTasks';
import { DynamicInput } from '../FormComponent/DynamicInput';
import { Button } from '../FormElement/Button';
import { ProjectTask } from '../ProjectTask';

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

  return (
    <div className="project-tasks">
      <Button
        type="button"
        customClassName="project-tasks__btn"
        onClick={handleClick}
      >
        Додати задачу
      </Button>
      {isActiveInput && (
        <div className="project-tasks__wrapper">
          <DynamicInput
            placeholder="Напишіть назву задачі"
            onClick={(value) => handleCreateNewTask(value)}
            onCancel={handleCloseInput}
            isActiveWithoutText={true}
            buttonLabel={'Створити'}
          />
        </div>
      )}

      {tasks.map((task, index) => (
        <ProjectTask key={task._id} task={task} index={index} />
      ))}
    </div>
  );
};
