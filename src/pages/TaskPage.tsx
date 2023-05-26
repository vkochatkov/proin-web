import { useSelector } from 'react-redux';
import { InteractiveInput } from '../components/FormComponent/InteractiveInput';
import { useForm } from '../hooks/useForm';
import { getAuth } from '../modules/selectors/user';
import { ITask } from '../modules/types/currentProjectTasks';

export const TaskPage = ({ task }: { task: ITask }) => {
  const { inputHandler } = useForm(
    {
      description: {
        value: '',
        isValid: true,
      },
    },
    true
  );
  const { token } = useSelector(getAuth);

  return (
    <>
      <InteractiveInput
        label={'Опис задачі'}
        id="description"
        inputHandler={inputHandler}
        token={token}
        project={null}
      />
    </>
  );
};
