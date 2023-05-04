import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingSpinner } from '../components/UIElements/LoadingSpinner';
import { useForm } from '../hooks/useForm';
import { ImageUpload } from '../components/FormElement/ImageUpload';
import {
  getCurrentProject,
  getCurrentProjects,
} from '../modules/selectors/mainProjects';
import { Button } from '../components/FormElement/Button';
import { useNavigate, useParams } from 'react-router-dom';
import { Header } from '../components/Navigation/Header';
import { getIsLoading } from '../modules/selectors/loading';
import {
  clearCurrentProject,
  deleteCurrentProject,
  openCurrentProject,
  updateProjects,
} from '../modules/actions/mainProjects';
import { Card } from '@mui/joy';
import { SnackbarUI } from '../components/UIElements/SnackbarUI';
import { findProjectMember } from '../utils/utils';
import { InvitePopup } from '../components/Popup/InvitePopup';
import { ProjectDescription } from '../components/FormComponent/ProjectInputEditor';
import { MoveProjectPopup } from '../components/Popup/MoveProjectPopup';
import { SubProjects } from '../components/SubProjects';
import { useAuth } from '../hooks/useAuth';
import TabsMenu from '../components/TabsMenu';

import './HomePage.scss';

type Props = {};

const EditProject: React.FC<Props> = () => {
  const { token, userId } = useAuth();
  const { pid } = useParams();
  const isLoading = useSelector(getIsLoading);
  const currentProject = useSelector(getCurrentProject);
  const isMemberAdded = findProjectMember(currentProject, userId);
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

  useEffect(() => {
    if (!currentProject && pid) {
      dispatch(openCurrentProject(token, pid, true) as any);
    }
  }, [currentProject, pid, token, dispatch]);

  return (
    <>
      <InvitePopup />
      <MoveProjectPopup />
      <SnackbarUI />
      <div className="container">
        <Header>
          <Button
            size="small"
            transparent={true}
            icon={true}
            customClassName="header__btn-close"
            onClick={handleCloseProject}
          >
            <img src="/back.svg" alt="back_logo" className="button__icon" />
          </Button>
          <Button
            customClassName="header__btn-transparent"
            disabled={isMemberAdded}
            onClick={
              currentProject
                ? () => handleRemoveCurrentProject(token, currentProject._id)
                : undefined
            }
          >
            <img src="/delete-icon.svg" alt="delete icon" />
          </Button>
        </Header>
        {isLoading ? (
          <div className="loading">
            <LoadingSpinner />
          </div>
        ) : (
          <Card
            sx={{
              background: '#f8f8f8',
            }}
          >
            <div>
              <>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                  }}
                >
                  <h3
                    style={{
                      marginTop: '5px',
                      marginBottom: '5px',
                    }}
                  >
                    Лого
                  </h3>
                </div>
                <ImageUpload
                  id="logoUrl"
                  onInput={inputHandler}
                  projectId={currentProject ? currentProject._id : undefined}
                  isUpdateValue={true}
                />
                <ProjectDescription
                  id="projectName"
                  inputHandler={inputHandler}
                  token={token}
                  project={currentProject}
                  label="Назва проекту"
                />
                <ProjectDescription
                  id="description"
                  inputHandler={inputHandler}
                  token={token}
                  project={currentProject}
                  label="Опис"
                />
                <SubProjects />
                <TabsMenu />
              </>
            </div>
          </Card>
        )}
      </div>
    </>
  );
};

export default EditProject;
