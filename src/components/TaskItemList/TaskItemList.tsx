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

import './TaskItemList.scss';

interface IProps {
  tasks: ITask[];
  changeOrder: (tasks: ITask[]) => void;
  generateNavigationString: (id: string) => void;
}

export const TaskItemList: React.FC<IProps> = ({
  tasks,
  changeOrder,
  generateNavigationString,
}) => {
  const dispatch = useDispatch();
  const {
    searchedTasks,
    isSearching,
    selectedSortOption,
    defaultSortOption,
    handleSortByAddingDate,
    handleSortbyLastCommentDate,
    handleSortByDeadline,
    handleSortByDefault,
    handleSearching,
  } = useFilter({ tasks });
  const isDraggable = selectedSortOption === defaultSortOption && !isSearching;
  const sortableTasks =
    selectedSortOption === defaultSortOption
      ? isSearching
        ? searchedTasks
        : tasks
      : searchedTasks;
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

  const handleFilterTasksList = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };

  return (
    <>
      <FilterModal
        submitHandler={handleFilterTasksList}
        modalId={modalId}
        label={'Виберіть фільтр для задач'}
      />
      <div className='tasks-items'>
        <Toolbar
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
