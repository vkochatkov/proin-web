import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { InteractiveInput } from '../../components/FormComponent/InteractiveInput';
import { TaskFilesUpload } from '../../components/FormComponent/TaskFilesUpload/TaskFilesUpload';
import { Button } from '../../components/FormElement/Button';
import { Header } from '../../components/Navigation/Header';
import { Card } from '../../components/UIElements/Card';
import { UserActivityDiary } from '../../components/UserActivityDiary';
import { useForm } from '../../hooks/useForm';
import { getCurrentTask } from '../../modules/selectors/currentTask';
import { getAuth } from '../../modules/selectors/user';

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

  const handleCloseTaskPage = () => {
    navigate(`/project-edit/${pid}`);
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
          <TaskFilesUpload id={'files'} />
        </Card>
        <UserActivityDiary />
      </Card>
    </div>
  );
};
