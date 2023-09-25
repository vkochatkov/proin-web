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
  const defaultSortOption = 'default';
  const tasks = useSelector(getAllUserTasks);
  const dispatch = useDispatch();
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [selectedSortOption, setSelectedSortOption] =
    useState<string>(defaultSortOption);
  const { saveChanges } = useDebounce();

  useEffect(() => {
    dispatch(fetchAllUserTasks() as any);
  }, [dispatch]);

  const handleSaveTaskItemOrder = (newOrder: ITask[]) => {
    dispatch(changeUserTasksOrder(newOrder) as any);
  };

  const handleGenerateNavigationQuery = (id: string) => `/tasks/${id}`;

  const handleSearching = (props: { newValue: string }) => {
    const { newValue } = props;

    saveChanges(() => {
      setFilteredTasks(
        tasks.filter((task) =>
          task.name.toLowerCase().includes(newValue.toLowerCase()),
        ),
      );
    });
  };

  const handleSortByAddingDate = () => {
    const sortedTasks = [...tasks].sort((a, b) => {
      const timestampA = new Date(a.timestamp).getTime();
      const timestampB = new Date(b.timestamp).getTime();
      return timestampA - timestampB;
    });

    setFilteredTasks(sortedTasks);
    setSelectedSortOption('byAddingDate');
  };

  const handleSortByDeadline = () => {
    setSelectedSortOption('byDeadlineDate');
  };

  const handleSortbyLastCommentDate = () => {
    setSelectedSortOption('byLastCommentDate');
  };

  const handleSortByDefault = () => {
    setFilteredTasks(tasks);
    setSelectedSortOption('default');
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
          selectedSortOption={selectedSortOption}
          setShowSearchInput={setShowSearchInput}
          handleSearching={handleSearching}
          onSortByAddingDate={handleSortByAddingDate}
          onSortByDeadline={handleSortByDeadline}
          onSortByLastCommentDate={handleSortbyLastCommentDate}
          onSortDefaultState={handleSortByDefault}
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
            tasks={
              selectedSortOption === defaultSortOption ? tasks : filteredTasks
            }
            isDraggable={selectedSortOption === defaultSortOption}
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
