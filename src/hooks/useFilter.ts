import { useState } from 'react';
import { ITask } from '../modules/types/tasks';
import { useDebounce } from './useDebounce';

interface IFilterFunctions {
  sortedTasks: ITask[];
  searchedTasks: ITask[];
  isSearching: boolean;
  selectedSortOption: string;
  defaultSortOption: string;
  handleSortByAddingDate: () => void;
  handleSortbyLastCommentDate: () => void;
  handleSortByDeadline: () => void;
  handleSortByDefault: () => void;
  handleSearching: ({ newValue }: { newValue: string }) => void;
}

export const useFilter = ({ tasks }: { tasks: ITask[] }): IFilterFunctions => {
  const defaultSortOption = 'default';
  const [sortedTasks, setSortingTasks] = useState(tasks);
  const [searchedTasks, setSearchedTasks] = useState(sortedTasks);
  const [selectedSortOption, setSelectedSortOption] =
    useState<string>(defaultSortOption);
  const { saveChanges } = useDebounce();
  const [isSearching, setIsSearching] = useState(false);
  const [searchedValue, setSearchedValue] = useState('');

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
              sortedTasks: sortedTasks,
            })
          : sortedTasks,
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
    setSortingTasks(sortedTasks);
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

    setSortingTasks(sortedTasks);
    setSearchedTasks(handleFilteringTasks({ sortedTasks }));
    setSelectedSortOption('byLastCommentDate');
  };

  const handleSortByDefault = () => {
    setSortingTasks(tasks);
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

  return {
    searchedTasks,
    sortedTasks,
    isSearching,
    selectedSortOption,
    defaultSortOption,
    handleSortByAddingDate,
    handleSortbyLastCommentDate,
    handleSortByDeadline,
    handleSortByDefault,
    handleSearching,
  };
};
