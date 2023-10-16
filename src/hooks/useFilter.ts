import { useEffect, useState } from 'react';
import { FilterFunction } from '../modules/types/filter';
import { IComment } from '../modules/types/mainProjects';

interface IFilterFunctions<T> {
  sortedItems: T[];
  searchedItems: T[];
  isSearching: boolean;
  selectedSortOption: string;
  defaultSortOption: string;
  handleSortByAddingDate: () => void;
  handleSortbyLastCommentDate: () => void;
  handleSortByDeadline: () => void;
  handleSortByDefault: () => void;
  handleSearching: ({ newValue }: { newValue: string }) => void;
  handleFilterByProjectId: (id: string) => void;
  isDraggable: boolean;
  sortableItems: T[];
  filterValue: string;
}

export const useFilter = <
  T extends {
    name?: string;
    projectId?: string;
    timestamp: string;
    comments?: IComment[];
  },
>({
  items,
  filterFunction,
  itemsName,
}: {
  items: T[];
  filterFunction: FilterFunction<T>;
  itemsName: string;
}): IFilterFunctions<T> => {
  const defaultSortOption = 'default';
  const savedSettings = JSON.parse(sessionStorage.getItem(itemsName) || '{}');
  const [sortedItems, setSortingItems] = useState(
    savedSettings.sortedItems || items,
  );
  const [searchedItems, setSearchedItems] = useState(
    savedSettings.searchedItems || sortedItems,
  );
  const [selectedSortOption, setSelectedSortOption] = useState<string>(
    savedSettings.selectedSortOption || defaultSortOption,
  );
  const [isSearching, setIsSearching] = useState(
    savedSettings.isSearching || false,
  );
  const [searchedValue, setSearchedValue] = useState(
    savedSettings.searchedValue || '',
  );
  const [projectIdValue, setProjectIdValue] = useState('');

  const isDraggable = selectedSortOption === defaultSortOption && !isSearching;
  const sortableItems =
    selectedSortOption === defaultSortOption
      ? isSearching
        ? searchedItems
        : items
      : searchedItems;

  useEffect(() => {
    sessionStorage.setItem(
      itemsName,
      JSON.stringify({
        sortedItems,
        selectedSortOption,
        isSearching,
        searchedValue,
        searchedItems,
      }),
    );
  }, [
    sortedItems,
    selectedSortOption,
    itemsName,
    isSearching,
    searchedValue,
    searchedItems,
  ]);

  const handleFilteringItems = ({
    value,
    sortedItems,
    projectId,
  }: {
    value?: string;
    sortedItems?: T[];
    projectId?: string;
  }) =>
    (sortedItems || items).filter((item) => {
      return filterFunction(item, value ?? searchedValue, projectId);
    });

  const handleSearching = (props: { newValue: string }) => {
    const { newValue } = props;

    if (newValue) {
      setIsSearching(true);
      setSearchedItems(
        handleFilteringItems({
          value: newValue,
          sortedItems,
          projectId: projectIdValue,
        }),
      );
    }

    setSearchedValue(newValue);

    if (!newValue) {
      setSearchedItems(
        handleFilteringItems({
          value: newValue,
          sortedItems,
          projectId: projectIdValue,
        }),
      );

      if (!projectIdValue) {
        setIsSearching(false);
      }
    }
  };

  const handleSortByAddingDate = () => {
    const sortedItems = [...items].sort((a, b) => {
      const timestampA = new Date(a.timestamp).getTime();
      const timestampB = new Date(b.timestamp).getTime();
      return timestampA - timestampB;
    });
    setSortingItems(sortedItems);
    setSearchedItems(
      handleFilteringItems({ sortedItems, projectId: projectIdValue }),
    );
    setSelectedSortOption('byAddingDate');
  };

  const handleSortByDeadline = () => {
    setSelectedSortOption('byDeadlineDate');
  };

  const handleSortbyLastCommentDate = () => {
    const sortedItems = [...items].sort((a, b) => {
      // Get the timestamps of the last comments for both items
      const lastCommentA = a.comments?.length
        ? a.comments[a.comments.length - 1].timestamp
        : a.timestamp; // Use item's timestamp if there are no comments
      const lastCommentB = b.comments?.length
        ? b.comments[b.comments.length - 1].timestamp
        : b.timestamp; // Use item's timestamp if there are no comments

      // Compare the timestamps
      const timestampA = new Date(lastCommentA).getTime();
      const timestampB = new Date(lastCommentB).getTime();
      return timestampA - timestampB;
    });

    setSortingItems(sortedItems);
    setSearchedItems(
      handleFilteringItems({ sortedItems, projectId: projectIdValue }),
    );
    setSelectedSortOption('byLastCommentDate');
  };

  const handleSortByDefault = () => {
    setSortingItems(items);
    setSearchedItems(
      handleFilteringItems({ sortedItems: items, projectId: projectIdValue }),
    );
    setSelectedSortOption('default');
  };

  const handleFilterByProjectId = (id: string) => {
    if (id) {
      const filteredTasks = [...sortedItems].filter(
        (item) => item.projectId === id,
      );

      setSearchedItems(
        handleFilteringItems({ sortedItems: filteredTasks, projectId: id }),
      );

      setIsSearching(true);
      setProjectIdValue(id);
      return;
    }

    setProjectIdValue('');
    setSearchedItems(handleFilteringItems({ sortedItems }));

    if (selectedSortOption === defaultSortOption && !searchedValue) {
      setIsSearching(false);
    }
  };

  return {
    searchedItems,
    sortedItems,
    isSearching,
    selectedSortOption,
    defaultSortOption,
    handleSortByAddingDate,
    handleSortbyLastCommentDate,
    handleSortByDeadline,
    handleSortByDefault,
    handleSearching,
    handleFilterByProjectId,
    isDraggable,
    sortableItems,
    filterValue: searchedValue,
  };
};