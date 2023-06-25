import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { FilesList } from '../../components/FilesList/FilesList';
import { InteractiveInput } from '../../components/FormComponent/InteractiveInput';
import { TaskFilesUpload } from '../../components/FormComponent/TaskFilesUpload/TaskFilesUpload';
import { Button } from '../../components/FormElement/Button';
import { Header } from '../../components/Navigation/Header';
import { Card } from '../../components/UIElements/Card';
import { useForm } from '../../hooks/useForm';
import { updateTaskFilesOrder } from '../../modules/actions/tasks';
import { setTabValue } from '../../modules/actions/tabs';
import { getCurrentTask } from '../../modules/selectors/currentTask';
import { IFile } from '../../modules/types/mainProjects';
import { SnackbarUI } from '../../components/UIElements/SnackbarUI';
import { TaskTabsMenu } from '../../components/TaskTabsMenu';

import '../HomePage.scss';
import './TaskPage.scss';

export const TaskPage = () => {
  const { inputHandler } = useForm(
    {
      name: {
        value: '',
        isValid: true,
      },
      description: {
        value: '',
        isValid: true,
      },
    },
    true
  );
  const task = useSelector(getCurrentTask);
  const { pid } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const tabsId = 'main-tabs';

  const handleCloseTaskPage = () => {
    if (pid) {
      dispatch(setTabValue({ [tabsId]: 'Задачі' }));
      navigate(`/project-edit/${pid}`);
    } else {
      navigate(`/tasks`);
    }
  };

  const saveFilesOrder = (order: IFile[]) => {
    dispatch(updateTaskFilesOrder({ files: order, taskId: task._id }) as any);
  };

  return (
    <>
      <SnackbarUI />
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
              entity={task}
            />
            <div className="task-page__input-wrapper">
              <InteractiveInput
                label={'Опис'}
                id="description"
                inputHandler={inputHandler}
                entity={task}
              />
            </div>
            <FilesList files={task.files} saveFilesOrder={saveFilesOrder} />
            <div className="task-page__uploader">
              <TaskFilesUpload id={'files'} />
            </div>
          </Card>
          <TaskTabsMenu />
          {/* <UserActivityDiary /> */}
        </Card>
      </div>
    </>
  );
};
