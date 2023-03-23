import React from 'react';
import { useSelector } from 'react-redux';
import { LoadingSpinner } from '../components/UIElements/LoadingSpinner';
import { Input } from '../components/FormElement/Input';
import { useHttpClient } from '../hooks/useHttpClient';
import { useForm } from '../hooks/useForm';
import { ImageUpload } from '../components/FormElement/ImageUpload';
import { getCurrentProject } from '../modules/selectors/mainProjects';
import { getAuth } from '../modules/selectors/user';
import { Button } from '../components/FormElement/Button';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Navigation/Header';

type Props = {};

export const NewProject: React.FC<Props> = () => {
  const { token } = useSelector(getAuth);
  const { isLoading } = useHttpClient();
  const currentProject = useSelector(getCurrentProject);
  const navigate = useNavigate();
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
              id="logo"
              onInput={inputHandler}
              projectId={currentProject ? currentProject._id : undefined}
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
            />
          </>
        </div>
      )}
    </div>
  );
};
