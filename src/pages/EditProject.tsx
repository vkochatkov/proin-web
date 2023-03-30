import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingSpinner } from '../components/UIElements/LoadingSpinner';
import { Input } from '../components/FormElement/Input';
import { useForm } from '../hooks/useForm';
import { ImageUpload } from '../components/FormElement/ImageUpload';
import { getCurrentProject } from '../modules/selectors/mainProjects';
import { getAuth } from '../modules/selectors/user';
import { Button } from '../components/FormElement/Button';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Navigation/Header';
import { getIsLoading } from '../modules/selectors/loading';
import { endLoading } from '../modules/actions/loading';

type Props = {};

const EditProject: React.FC<Props> = () => {
  const { token } = useSelector(getAuth);
  const isLoading = useSelector(getIsLoading);
  const currentProject = useSelector(getCurrentProject);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { inputHandler } = useForm(
    {
      projectName: {
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

  useEffect(() => {
    dispatch(endLoading());
    // eslint-disable-next-line
  }, []);

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div className="container">
      <Header>
        <Button
          size="small"
          transparent={true}
          icon={true}
          customClassName="header__btn-close"
          onClick={handleClick}
        >
          <img src="/close.svg" alt="close_logo" className="button__icon" />
        </Button>
        <Button customClassName="header__btn-transparent" onClick={handleClick}>
          СТВОРИТИ
        </Button>
      </Header>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div>
          <>
            <ImageUpload
              center
              id="logoUrl"
              onInput={inputHandler}
              projectId={currentProject ? currentProject._id : undefined}
              stateToUpdate={true}
            />
            <Input
              id="projectName"
              element="input"
              type="text"
              label="Ім'я нового проекту"
              onInput={inputHandler}
              isAnyValue={true}
              isAutosave={true}
              projectId={currentProject ? currentProject._id : undefined}
              token={token}
              stateToUpdate={true}
              project={currentProject}
            />
            <Input
              id="description"
              element="textarea"
              label="Опис"
              onInput={inputHandler}
              isAnyValue={true}
              isAutosave={true}
              projectId={currentProject ? currentProject._id : undefined}
              token={token}
              stateToUpdate={true}
              project={currentProject}
            />
          </>
        </div>
      )}
    </div>
  );
};

export default EditProject;