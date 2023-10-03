import { useState } from 'react';
import { ITask } from '../modules/types/tasks';

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
  handleFilterByProjectName: (id: string) => void;
}

export const useFilter = ({ tasks }: { tasks: ITask[] }): IFilterFunctions => {
  const defaultSortOption = 'default';
  const [sortedTasks, setSortingTasks] = useState(tasks);
  const [searchedTasks, setSearchedTasks] = useState(sortedTasks);
  const [selectedSortOption, setSelectedSortOption] =
    useState<string>(defaultSortOption);
  const [isSearching, setIsSearching] = useState(false);
  const [searchedValue, setSearchedValue] = useState('');
  const [projectIdValue, setProjectIdValue] = useState('');

  const handleFilteringTasks = ({
    value,
    sortedTasks,
    projectId,
  }: {
    value?: string;
    sortedTasks?: ITask[];
    projectId?: string;
  }) =>
    (sortedTasks || tasks).filter((task) => {
      const nameMatch = task.name
        .toLowerCase()
        .includes((value ?? searchedValue).toLowerCase());

      if (projectId) {
        const projectIdMatch = task.projectId === projectId;
        return nameMatch && projectIdMatch;
      }

      return nameMatch;
    });

  const handleSearching = (props: { newValue: string }) => {
    const { newValue } = props;

    if (newValue) {
      setIsSearching(true);
      setSearchedTasks(
        handleFilteringTasks({
          value: newValue,
          sortedTasks,
          projectId: projectIdValue,
        }),
      );
    }

    setSearchedValue(newValue);

    if (!newValue) {
      setSearchedTasks(
        handleFilteringTasks({
          value: newValue,
          sortedTasks,
          projectId: projectIdValue,
        }),
      );
    }
  };

  const handleSortByAddingDate = () => {
    const sortedTasks = [...tasks].sort((a, b) => {
      const timestampA = new Date(a.timestamp).getTime();
      const timestampB = new Date(b.timestamp).getTime();
      return timestampA - timestampB;
    });
    setSortingTasks(sortedTasks);
    setSearchedTasks(
      handleFilteringTasks({ sortedTasks, projectId: projectIdValue }),
    );
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
    setSearchedTasks(
      handleFilteringTasks({ sortedTasks, projectId: projectIdValue }),
    );
    setSelectedSortOption('byLastCommentDate');
  };

  const handleSortByDefault = () => {
    setSortingTasks(tasks);
    setSearchedTasks(
      handleFilteringTasks({ sortedTasks: tasks, projectId: projectIdValue }),
    );
    setSelectedSortOption('default');
  };

  const handleFilterByProjectName = (id: string) => {
    if (id) {
      const filteredTasks = [...sortedTasks].filter(
        (task) => task.projectId === id,
      );

      setSearchedTasks(
        handleFilteringTasks({ sortedTasks: filteredTasks, projectId: id }),
      );

      setIsSearching(true);
      setProjectIdValue(id);
      return;
    }

    setProjectIdValue('');
    setSearchedTasks(handleFilteringTasks({ sortedTasks }));
  };

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
    handleFilterByProjectName,
  };
};
