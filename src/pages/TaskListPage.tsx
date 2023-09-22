import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Container } from '@mui/material';
import { TaskItemList } from '../components/TaskItemList/TaskItemList';
import { fetchAllUserTasks } from '../modules/actions/tasks';
import { changeUserTasksOrder } from '../modules/actions/userTasks';
import { getAllUserTasks } from '../modules/selectors/userTasks';
import { ITask } from '../modules/types/tasks';
import { RemoveTaskModal } from '../components/Modals/RemoveTaskModal';
import { Toolbar } from '../components/Toolbar/Toolbar';
import { useDebounce } from '../hooks/useDebounce';

type Props = {};

const TaskListPage: React.FC<Props> = () => {
  const tasks = useSelector(getAllUserTasks);
  const dispatch = useDispatch();
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const { saveChanges } = useDebounce();

  useEffect(() => {
    dispatch(fetchAllUserTasks() as any);
  }, [dispatch]);

  const handleSaveTaskItemOrder = (newOrder: ITask[]) => {
    dispatch(changeUserTasksOrder(newOrder) as any);
  };

  const handleGenerateNavigationQuery = (id: string) => {
    return `/tasks/${id}`;
  };

  const handleSearching = (props: {
    action: string;
    type: string;
    newValue: string;
  }) => {
    const { newValue } = props;

    saveChanges(() => {
      setFilteredTasks(
        tasks.filter((task) =>
          task.name.toLowerCase().includes(newValue.toLowerCase()),
        ),
      );
    });
  };

  return (
    <>
      <Container
        sx={{
          padding: '0 10px',
        }}
      >
        <Toolbar
          showSearchInput={showSearchInput}
          setShowSearchInput={setShowSearchInput}
          handleSearching={handleSearching}
        />
        <Card
          sx={{
            '&.MuiPaper-root': {
              backgroundColor: 'rgba(248, 248, 248, 0.8)',
              padding: '0 5px',
            },
          }}
        >
          <TaskItemList
            tasks={filteredTasks}
            changeOrder={handleSaveTaskItemOrder}
            generateNavigationString={handleGenerateNavigationQuery}
          />
        </Card>
      </Container>
      <RemoveTaskModal />
    </>
  );
};

export default TaskListPage;
