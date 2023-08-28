import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setIsActiveInput } from '../modules/actions/input';
import { createTask } from '../modules/actions/tasks';
import { getIsActiveInputStatus } from '../modules/selectors/input';
import { ConfirmInputComponent } from './ConfirmInputComponent/ConfirmInputComponent';

export const CreateTaskInput = () => {
  const isActiveInput = useSelector(getIsActiveInputStatus);
  const dispatch = useDispatch();
  const { pid, subprojectId } = useParams();

  const handleCreateNewTask = (props: {
    action: string;
    type: string;
    newValue: string;
  }) => {
    const { newValue } = props;

    if (!pid) return;
    if (!newValue) return;

    if (!subprojectId) {
      dispatch(createTask({ projectId: pid, name: newValue }) as any);
    } else {
      dispatch(createTask({ projectId: subprojectId, name: newValue }) as any);
    }
  };

  return (
    <>
      {isActiveInput && (
        <div className='project-tasks__wrapper'>
          <ConfirmInputComponent
            isActive={isActiveInput}
            onConfirm={handleCreateNewTask}
            setIsActive={(value: boolean) => dispatch(setIsActiveInput(value))}
            type={'task'}
            action={'addTask'}
            placeholder='Введіть назву задачі'
          />
        </div>
      )}
    </>
  );
};
