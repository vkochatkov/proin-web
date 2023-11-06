import { useSelector, useDispatch } from 'react-redux';
import { Card, Container } from '@mui/material';
import { TaskItemList } from '../components/TaskItemList/TaskItemList';
import { changeUserTasksOrder } from '../modules/actions/userTasks';
import { getAllUserTasks } from '../modules/selectors/userTasks';
import { ITask } from '../modules/types/tasks';
import { RemoveTaskModal } from '../components/Modals/RemoveTaskModal';
import { filterNames } from '../config/contsants';
import { LoadingSpinner } from '../components/UIElements/LoadingSpinner';
import { getIsLoading } from '../modules/selectors/loading';
import { CreateTaskInput } from '../components/CreateTaskInput';
import { setIsActiveInput } from '../modules/actions/input';

type Props = {};

const TaskListPage: React.FC<Props> = () => {
  const tasks = useSelector(getAllUserTasks);
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoading);

  const handleSaveTaskItemOrder = (newOrder: ITask[]) => {
    dispatch(changeUserTasksOrder(newOrder) as any);
  };

  const handleGenerateNavigationQuery = (id: string) => `/tasks/${id}`;

  const handleOpenTaskNameInput = () => {
    dispatch(setIsActiveInput(true));
  };

  return (
    <>
      <Container
        sx={{
          padding: '0 10px',
        }}
      >
        {isLoading && (
          <div className='loading'>
            <LoadingSpinner />
          </div>
        )}
        <Card
          sx={{
            '&.MuiPaper-root': {
              backgroundColor: 'rgba(248, 248, 248, 0.8)',
              padding: '0 5px',
            },
          }}
        >
          <CreateTaskInput isUserPage />
          <TaskItemList
            tasks={tasks}
            changeOrder={handleSaveTaskItemOrder}
            generateNavigationString={handleGenerateNavigationQuery}
            itemsName={filterNames.userTasks}
            onAdd={handleOpenTaskNameInput}
          />
        </Card>
      </Container>
      <RemoveTaskModal />
    </>
  );
};

export default TaskListPage;
