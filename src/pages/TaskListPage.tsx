import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Container } from '@mui/material';
import { TaskItemList } from '../components/TaskItemList/TaskItemList';
// import { fetchAllUserTasks } from '../modules/actions/tasks';
import { changeUserTasksOrder } from '../modules/actions/userTasks';
import { getAllUserTasks } from '../modules/selectors/userTasks';
import { ITask } from '../modules/types/tasks';
import { RemoveTaskModal } from '../components/Modals/RemoveTaskModal';
import { filterNames } from '../config/contsants';

type Props = {};

const TaskListPage: React.FC<Props> = () => {
  const tasks = useSelector(getAllUserTasks);
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(fetchAllUserTasks() as any);
  }, [dispatch]);

  const handleSaveTaskItemOrder = (newOrder: ITask[]) => {
    dispatch(changeUserTasksOrder(newOrder) as any);
  };

  const handleGenerateNavigationQuery = (id: string) => `/tasks/${id}`;

  return (
    <>
      <Container
        sx={{
          padding: '0 10px',
        }}
      >
        <Card
          sx={{
            '&.MuiPaper-root': {
              backgroundColor: 'rgba(248, 248, 248, 0.8)',
              padding: '0 5px',
            },
          }}
        >
          <TaskItemList
            tasks={tasks}
            changeOrder={handleSaveTaskItemOrder}
            generateNavigationString={handleGenerateNavigationQuery}
            itemsName={filterNames.userTasks}
          />
        </Card>
      </Container>
      <RemoveTaskModal />
    </>
  );
};

export default TaskListPage;
