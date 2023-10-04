import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { TaskItem } from '../TaskItem/TaskItem';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { reorder } from '../../utils/utils';
import { setIsDragging } from '../../modules/actions/dragging';
import { clearInputState } from '../../modules/actions/input';
import { ITask } from '../../modules/types/tasks';
import { Toolbar } from '../Toolbar/Toolbar';
import { useFilter } from '../../hooks/useFilter';
import { FilterModal } from '../Modals/FilterModal';
import { FilterFunction } from '../../modules/types/filter';

import './TaskItemList.scss';

interface IProps {
  tasks: ITask[];
  changeOrder: (tasks: ITask[]) => void;
  generateNavigationString: (id: string) => void;
}

const tasksFilterFunction: FilterFunction<ITask> = (item, value, projectId) => {
  const nameMatch = item.name.toLowerCase().includes(value.toLowerCase());

  if (projectId) {
    const projectIdMatch = item.projectId === projectId;
    return nameMatch && projectIdMatch;
  }

  return nameMatch;
};

export const TaskItemList: React.FC<IProps> = ({
  tasks,
  changeOrder,
  generateNavigationString,
}) => {
  const dispatch = useDispatch();
  const {
    searchedItems,
    isSearching,
    selectedSortOption,
    defaultSortOption,
    handleSortByAddingDate,
    handleSortbyLastCommentDate,
    handleSortByDeadline,
    handleSortByDefault,
    handleSearching,
    handleFilterByProjectName,
  } = useFilter({ items: tasks, filterFunction: tasksFilterFunction });

  const isDraggable = selectedSortOption === defaultSortOption && !isSearching;
  const sortableTasks =
    selectedSortOption === defaultSortOption
      ? isSearching
        ? searchedItems
        : tasks
      : searchedItems;
  const modalId = 'filter-tasks-modal';

  useEffect(() => {
    return () => {
      dispatch(clearInputState());
    };
  }, [dispatch]);

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const newOrder = reorder(
      tasks,
      result.source.index,
      result.destination.index,
    );

    changeOrder(newOrder);
    dispatch(setIsDragging(false));
  };

  const handleFilterTasks = (
    e: { preventDefault: () => void },
    projectId: string,
  ) => {
    e.preventDefault();

    handleFilterByProjectName(projectId);
  };

  return (
    <>
      <FilterModal
        submitHandler={handleFilterTasks}
        modalId={modalId}
        label={'Виберіть фільтр для задач'}
      />
      <div className='tasks-items'>
        <Toolbar
          modalId={modalId}
          selectedSortOption={selectedSortOption}
          handleSearching={handleSearching}
          onSortByAddingDate={handleSortByAddingDate}
          onSortByDeadline={handleSortByDeadline}
          onSortByLastCommentDate={handleSortbyLastCommentDate}
          onSortDefaultState={handleSortByDefault}
        />
        <div>
          {isDraggable && (
            <DragDropContext
              onDragEnd={onDragEnd}
              onDragStart={() => dispatch(setIsDragging(true))}
            >
              <Droppable droppableId='droppable'>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {tasks.map((task, index) => (
                      <TaskItem
                        task={task}
                        index={index}
                        key={task._id}
                        isDraggable={isDraggable}
                        generateNavigationString={generateNavigationString}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          )}
          {!isDraggable && (
            <>
              {sortableTasks.map((task, index) => (
                <TaskItem
                  task={task}
                  index={index}
                  key={task._id}
                  generateNavigationString={generateNavigationString}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </>
  );
};
