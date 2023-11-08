import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { PROJECTS_PATH } from '../config/routes';
import { changeTasksOrder, fetchTasks } from '../modules/actions/tasks';
import { getTasks } from '../modules/selectors/tasks';
import { ITask } from '../modules/types/tasks';
import { CreateTaskInput } from './CreateTaskInput';
import { TaskItemList } from './TaskItemList/TaskItemList';
import { filterNames } from '../config/contsants';

export const ProjectTasksComponent = () => {
  const tasks = useSelector(getTasks);
  const { pid, subprojectId } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!subprojectId && pid) {
      dispatch(fetchTasks(pid) as any);
    }

    if (pid && subprojectId) {
      dispatch(fetchTasks(subprojectId) as any);
    }
  }, [dispatch, pid, subprojectId]);

  const handleChangeTaskItemOrder = (newOrder: ITask[]) => {
    if (!pid) return;

    if (!subprojectId) {
      dispatch(changeTasksOrder(pid, newOrder) as any);
    } else {
      dispatch(changeTasksOrder(subprojectId, newOrder) as any);
    }
  };

  const handleGenerateNavigationQuery = (id: string) => {
    const query =
      pid && subprojectId
        ? `${PROJECTS_PATH}/${pid}/${subprojectId}/task/${id}`
        : `${PROJECTS_PATH}/${pid}/task/${id}`;

    return query;
  };

  return (
    <>
      <CreateTaskInput />
      <TaskItemList
        tasks={tasks}
        changeOrder={handleChangeTaskItemOrder}
        generateNavigationString={handleGenerateNavigationQuery}
        itemsName={filterNames.projectTasks}
      />
    </>
  );
};
