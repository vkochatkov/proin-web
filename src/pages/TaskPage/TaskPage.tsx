import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FilesList } from '../../components/FilesList/FilesList';
import { InteractiveInput } from '../../components/FormComponent/InteractiveInput';
import { TaskFilesUpload } from '../../components/FormComponent/TaskFilesUpload/TaskFilesUpload';
import { Button } from '../../components/FormElement/Button';
import { Header } from '../../components/Navigation/Header';
import { Card } from '../../components/UIElements/Card';
import { UserActivityDiary } from '../../components/UserActivityDiary';
import { useForm } from '../../hooks/useForm';
import { updateTaskFilesOrder } from '../../modules/actions/currentProjectTasks';
import { setTabValue } from '../../modules/actions/tabs';
import { getCurrentTask } from '../../modules/selectors/currentTask';
import { getAuth } from '../../modules/selectors/user';
import { IFile } from '../../modules/types/mainProjects';

import '../HomePage.scss';
import './TaskPage.scss';

export const TaskPage = () => {
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
  const task = useSelector(getCurrentTask);
  const { pid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCloseTaskPage = () => {
    dispatch(setTabValue({ ['main-tab']: 'Задачі' }));
    navigate(`/project-edit/${pid}`);
  };

  const saveFilesOrder = (order: IFile[]) => {
    dispatch(updateTaskFilesOrder({ files: order, taskId: task._id }) as any);
  };

  return (
    <div className="container">
      <Header>
        <Button
          size="small"
          transparent={true}
          icon={true}
          customClassName="header__btn-close"
          onClick={handleCloseTaskPage}
        >
          <img src="/back.svg" alt="back_logo" className="button__icon" />
        </Button>
      </Header>
      <Card>
        <Card className="task-page__card">
          <InteractiveInput
            id="name"
            inputHandler={inputHandler}
            token={token}
            entity={task}
          />
          <InteractiveInput
            label={'Опис'}
            id="description"
            inputHandler={inputHandler}
            token={token}
            entity={task}
          />
          <FilesList files={task.files} saveFilesOrder={saveFilesOrder} />
          <div className="task-page__uploader">
            <TaskFilesUpload id={'files'} />
          </div>
        </Card>
        <UserActivityDiary />
      </Card>
    </div>
  );
};
