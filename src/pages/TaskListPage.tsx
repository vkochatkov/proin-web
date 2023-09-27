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
  const [filteredTasks, setFilteredTasks] = useState(tasks);
  const [searchedTasks, setSearchedTasks] = useState(filteredTasks);
  const [selectedSortOption, setSelectedSortOption] =
    useState<string>(defaultSortOption);
  const { saveChanges } = useDebounce();
  const [isSearching, setIsSearching] = useState(false);
  const [searchedValue, setSearchedValue] = useState('');

  useEffect(() => {
    dispatch(fetchAllUserTasks() as any);
  }, [dispatch]);

  const handleSaveTaskItemOrder = (newOrder: ITask[]) => {
    dispatch(changeUserTasksOrder(newOrder) as any);
  };

  const handleGenerateNavigationQuery = (id: string) => `/tasks/${id}`;

  const handleFilteringTasks = ({
    value,
    sortedTasks,
  }: {
    value?: string;
    sortedTasks?: ITask[];
  }) =>
    (sortedTasks || tasks).filter((task) =>
      task.name.toLowerCase().includes((value ?? searchedValue).toLowerCase()),
    );

  const handleSearching = (props: { newValue: string }) => {
    const { newValue } = props;

    if (newValue) {
      setIsSearching(true);
    }

    saveChanges(() => {
      setSearchedTasks(
        newValue
          ? handleFilteringTasks({
              value: newValue,
              sortedTasks: filteredTasks,
            })
          : filteredTasks,
      );
    });

    setSearchedValue(newValue);

    if (!newValue) {
      const timeoutId = setTimeout(() => {
        setIsSearching(false);
        handleSortBySelectedOption();
      }, 1000);

      // Clear the timeout on component unmount or when searchedValue changes
      return () => clearTimeout(timeoutId);
    }
  };

  const handleSortByAddingDate = () => {
    const sortedTasks = [...tasks].sort((a, b) => {
      const timestampA = new Date(a.timestamp).getTime();
      const timestampB = new Date(b.timestamp).getTime();
      return timestampA - timestampB;
    });
    setFilteredTasks(sortedTasks);
    setSearchedTasks(handleFilteringTasks({ sortedTasks }));
    setSelectedSortOption('byAddingDate');
  };

  const handleSortByDeadline = () => {
    setSelectedSortOption('byDeadlineDate');
  };

  const handleSortbyLastCommentDate = () => {
    const sortedTasks = [...tasks].sort((a, b) => {
      // Get the timestamps of the last comments for both tasks
      const lastCommentA = a.comments?.length
        ? a.comments[a.comments.length - 1].timestamp
        : a.timestamp; // Use task's timestamp if there are no comments
      const lastCommentB = b.comments?.length
        ? b.comments[b.comments.length - 1].timestamp
        : b.timestamp; // Use task's timestamp if there are no comments

      // Compare the timestamps
      const timestampA = new Date(lastCommentA).getTime();
      const timestampB = new Date(lastCommentB).getTime();
      return timestampA - timestampB;
    });

    setFilteredTasks(sortedTasks);
    setSearchedTasks(handleFilteringTasks({ sortedTasks }));
    setSelectedSortOption('byLastCommentDate');
  };

  const handleSortByDefault = () => {
    setFilteredTasks(tasks);
    setSearchedTasks(handleFilteringTasks({ sortedTasks: tasks }));
    setSelectedSortOption('default');
  };

  function handleSortBySelectedOption() {
    switch (selectedSortOption) {
      case 'byAddingDate':
        handleSortByAddingDate();
        break;
      case 'byDeadlineDate':
        handleSortByDeadline();
        break;
      case 'byLastCommentDate':
        handleSortbyLastCommentDate();
        break;
      default:
        handleSortByDefault();
        break;
    }
  }

  return (
    <>
      <Container
        sx={{
          padding: '0 10px',
        }}
      >
        <Toolbar
          selectedSortOption={selectedSortOption}
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
              selectedSortOption === defaultSortOption
                ? isSearching
                  ? searchedTasks
                  : tasks
                : searchedTasks
            }
            isDraggable={
              selectedSortOption === defaultSortOption && !isSearching
            }
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
