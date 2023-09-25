import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { TaskItem } from '../TaskItem/TaskItem';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { reorder } from '../../utils/utils';
import { setIsDragging } from '../../modules/actions/dragging';
import { clearInputState } from '../../modules/actions/input';
import { ITask } from '../../modules/types/tasks';

import './TaskItemList.scss';

interface IProps {
  tasks: ITask[];
  isDraggable?: boolean;
  changeOrder: (tasks: ITask[]) => void;
  generateNavigationString: (id: string) => void;
}

export const TaskItemList: React.FC<IProps> = ({
  tasks,
  isDraggable = false,
  changeOrder,
  generateNavigationString,
}) => {
  const dispatch = useDispatch();

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

  return (
    <div className='tasks-items'>
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
            {tasks.map((task, index) => (
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
  );
};
