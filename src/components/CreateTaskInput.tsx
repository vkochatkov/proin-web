import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setIsActiveInput } from '../modules/actions/input';
import { createTask } from '../modules/actions/tasks';
import { getIsActiveInputStatus } from '../modules/selectors/input';
import { DynamicInput } from './FormComponent/DynamicInput';

export const CreateTaskInput = () => {
  const isActiveInput = useSelector(getIsActiveInputStatus);
  const dispatch = useDispatch();
  const { pid } = useParams();

  const handleCloseInput = () => {
    dispatch(setIsActiveInput(false));
  };

  const handleCreateNewTask = (value: string) => {
    if (!pid) return;

    dispatch(createTask({ projectId: pid, name: value }) as any);
  };

  return (
    <>
      {isActiveInput && (
        <div className="project-tasks__wrapper">
          <DynamicInput
            placeholder="Напишіть назву задачі"
            onClick={(value) => {
              handleCreateNewTask(value);
              dispatch(setIsActiveInput(false));
            }}
            onCancel={handleCloseInput}
            isActiveWithoutText={true}
            buttonLabel={'Створити'}
          />
        </div>
      )}
    </>
  );
};
