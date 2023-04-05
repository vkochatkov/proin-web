import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingSpinner } from '../components/UIElements/LoadingSpinner';
import { Input } from '../components/FormElement/Input';
import { useForm } from '../hooks/useForm';
import { ImageUpload } from '../components/FormElement/ImageUpload';
import {
  getCurrentProject,
  getCurrentProjects,
} from '../modules/selectors/mainProjects';
import { getAuth } from '../modules/selectors/user';
import { Button } from '../components/FormElement/Button';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Navigation/Header';
import { getIsLoading } from '../modules/selectors/loading';
import {
  clearCurrentProject,
  deleteCurrentProject,
  updateProjects,
} from '../modules/actions/mainProjects';

type Props = {};

const EditProject: React.FC<Props> = () => {
  const { token } = useSelector(getAuth);
  const isLoading = useSelector(getIsLoading);
  const currentProject = useSelector(getCurrentProject);
  const projects = useSelector(getCurrentProjects);
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

  const handleRemoveCurrentProject = async (
    token: string,
    projectId: string
  ) => {
    try {
      await dispatch(deleteCurrentProject(token, projectId) as any);

      const updatedProjectsList = projects.filter(
        (project) => project._id !== projectId
      );

      dispatch(updateProjects(updatedProjectsList));
      navigate('/');
    } catch (error) {}
  };

  const handleCloseProject = () => {
    navigate('/');
    dispatch(clearCurrentProject());
  };

  return (
    <div className="container">
      <Header>
        <Button
          size="small"
          transparent={true}
          icon={true}
          customClassName="header__btn-close"
          onClick={handleCloseProject}
        >
          <img src="/close.svg" alt="close_logo" className="button__icon" />
        </Button>
        <Button
          customClassName="header__btn-transparent"
          onClick={
            currentProject
              ? () => handleRemoveCurrentProject(token, currentProject._id)
              : undefined
          }
        >
          <img src="/delete-icon.svg" alt="delete icon" />
        </Button>
      </Header>
      {isLoading && !currentProject ? (
        <div className="loading">
          <LoadingSpinner />
        </div>
      ) : (
        <div>
          <>
            <ImageUpload
              center
              id="logoUrl"
              onInput={inputHandler}
              projectId={currentProject ? currentProject._id : undefined}
              isUpdateValue={true}
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
              isUpdateValue={true}
              project={currentProject}
              labelClassName={'label--white'}
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
              isUpdateValue={true}
              project={currentProject}
              labelClassName={'label--white'}
            />
          </>
        </div>
      )}
    </div>
  );
};

export default EditProject;
