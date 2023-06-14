import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { changeTasksOrder } from '../modules/actions/tasks';
import { getTasks } from '../modules/selectors/tasks';
import { ITask } from '../modules/types/projectTasks';
import { CreateTaskInput } from './CreateTaskInput';
import { ProjectTaskItemList } from './ProjectTaskItemList/ProjectTaskItemList';

export const ProjectTasksComponent = () => {
  const tasks = useSelector(getTasks);
  const { pid } = useParams();
  const dispatch = useDispatch();

  const handleChangeTaskItemOrder = (newOrder: ITask[]) => {
    if (!pid) return;

    dispatch(changeTasksOrder(pid, newOrder) as any);
  };

  const handleGenerateNavigationQuery = (id: string) => {
    return `/project-edit/${pid}/task/${id}`;
  };

  return (
    <>
      <CreateTaskInput />
      <ProjectTaskItemList
        tasks={tasks}
        changeOrder={handleChangeTaskItemOrder}
        generateNavigationString={handleGenerateNavigationQuery}
      />
    </>
  );
};
