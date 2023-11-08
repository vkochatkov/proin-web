import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import AddIcon from '@mui/icons-material/Add';
import { Button } from '../FormElement/Button';
import { MoveItemModal } from '../Modals/MoveItemModal';
import { changeTaskProject } from '../../modules/actions/tasks';
import { getSelectedTaskId } from '../../modules/selectors/selectedTask';

import './TaskItemList.scss';

interface IProps {
  tasks: ITask[];
  itemsName: string;
  changeOrder: (tasks: ITask[]) => void;
  generateNavigationString: (id: string) => void;
  onAdd?: () => void;
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
  itemsName,
  onAdd,
}) => {
  const dispatch = useDispatch();
  const {
    selectedSortOption,
    handleSortByAddingDate,
    handleSortbyLastCommentDate,
    handleSortByDeadline,
    handleSortByDefault,
    handleSearching,
    handleFilterByProjectId,
    isDraggable,
    sortableItems,
    filterValue,
  } = useFilter({
    items: tasks,
    filterFunction: tasksFilterFunction,
    itemsName,
  });
  const selectedTaskId = useSelector(getSelectedTaskId);
  const filterModalId = 'filter-tasks-modal';

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

    handleFilterByProjectId(projectId);
  };

  const handleSubmitTaskMoving = (projectId: string) => {
    dispatch(changeTaskProject(selectedTaskId, projectId) as any);
  };

  return (
    <>
      <FilterModal
        submitHandler={handleFilterTasks}
        modalId={filterModalId}
        label={'Виберіть фільтр для задач'}
        itemsName={itemsName}
      />
      <MoveItemModal
        modalId='move-task'
        handleSubmit={handleSubmitTaskMoving}
      />
      <div className='tasks-items'>
        <Toolbar
          modalId={filterModalId}
          selectedSortOption={selectedSortOption}
          handleSearching={handleSearching}
          onSortByAddingDate={handleSortByAddingDate}
          onSortByDeadline={handleSortByDeadline}
          onSortByLastCommentDate={handleSortbyLastCommentDate}
          onSortDefaultState={handleSortByDefault}
          filterValue={filterValue}
        >
          <>
            {onAdd && (
              <Button transparent icon onClick={onAdd}>
                <AddIcon />
              </Button>
            )}
          </>
        </Toolbar>
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
              {sortableItems &&
                sortableItems.map((task, index) => (
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
