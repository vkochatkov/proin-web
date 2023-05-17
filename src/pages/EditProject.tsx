import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingSpinner } from '../components/UIElements/LoadingSpinner';
import { useForm } from '../hooks/useForm';
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
  createNewSubproject,
  fetchProjects,
  openCurrentProject,
} from '../modules/actions/mainProjects';
import { Card } from '@mui/joy';
import { SnackbarUI } from '../components/UIElements/SnackbarUI';
import { InviteModal } from '../components/Modals/InviteModal';
import { ProjectDescription } from '../components/FormComponent/ProjectInputEditor';
import { MoveProjectModal } from '../components/Modals/MoveProjectModal';
import { SubProjects } from '../components/SubProjects';
import { useAuth } from '../hooks/useAuth';
import TabsMenu from '../components/TabsMenu';
import { Project } from '../modules/reducers/mainProjects';
import { RemoveProjectModal } from '../components/Modals/RemoveProjectModal';
import { clearFormInput } from '../modules/actions/form';
import { FilesList } from '../components/FilesList';
import { ImageUpload } from '../components/FormComponent/ImageUpload';
import { FilesUpload } from '../components/FormComponent/FilesUpload';

import './HomePage.scss';
import { endLoading, startLoading } from '../modules/actions/loading';

type Props = {};

const EditProject: React.FC<Props> = () => {
  const { token, userId } = useAuth();
  const { pid, subprojectId } = useParams();
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

  useEffect(() => {
    if (!currentProject || (currentProject && !currentProject._id)) return;

    const foundProjects = projects.find((project) =>
      project.subProjects.some((p: Project) => p.id === subprojectId)
    );

    const subProject = foundProjects ? foundProjects.subProjects[0] : null;

    if (
      pid &&
      !subprojectId &&
      currentProject &&
      currentProject._id.length !== pid.length
    ) {
      navigate('/');
      return;
    }

    if (
      pid &&
      currentProject._id &&
      currentProject._id !== pid &&
      !subprojectId
    ) {
      dispatch(openCurrentProject(token, pid) as any);
      return;
    }

    if (pid && !currentProject && !subprojectId) {
      dispatch(openCurrentProject(token, pid) as any);
      return;
    }

    if (
      subprojectId &&
      currentProject &&
      currentProject.id &&
      currentProject.id.length !== subprojectId.length
    ) {
      navigate(`/project-edit/${pid}`);
      return;
    }

    if (subprojectId && subProject && !currentProject) {
      dispatch(openCurrentProject(token, subprojectId, true) as any);
      return;
    }

    if (subprojectId && currentProject && currentProject.id !== subprojectId) {
      dispatch(openCurrentProject(token, subprojectId, true) as any);
    }
  }, [pid, token, subprojectId, currentProject, navigate, dispatch]);

  const handleCloseProject = async () => {
    if (subprojectId) {
      dispatch(startLoading());
      await dispatch(fetchProjects() as any);
      navigate(`/project-edit/${pid}`);
      dispatch(endLoading());
    } else {
      navigate('/');
      dispatch(clearCurrentProject());
      dispatch(clearFormInput());
    }
  };

  const handleCreateSubproject = async () => {
    if (!pid) return;

    try {
      const { _id } = await dispatch(createNewSubproject(pid) as any);

      navigate(`/project-edit/${pid}/${_id}`);
      await dispatch(fetchProjects() as any);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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
            size="small"
            transparent={true}
            icon={true}
            onClick={handleCreateSubproject}
          >
            <img
              src="/plus_icon.svg"
              className="button__icon"
              alt="button icon"
            />
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
                ></div>
                <ImageUpload
                  onInput={inputHandler}
                  projectId={currentProject ? currentProject._id : undefined}
                  id="logoUrl"
                  inputHandler={inputHandler}
                  isUpdateValue={true}
                />
                <ProjectDescription
                  id="projectName"
                  inputHandler={inputHandler}
                  token={token}
                  project={currentProject}
                />
                <ProjectDescription
                  id="description"
                  inputHandler={inputHandler}
                  token={token}
                  project={currentProject}
                  label="Опис"
                />
                <h3>Вкладення</h3>
                <FilesList />
                <FilesUpload
                  id={'files'}
                  projectId={currentProject ? currentProject._id : undefined}
                />
                {subprojectId ? null : <SubProjects />}
                <TabsMenu />
              </>
            </div>
          </Card>
        )}
      </div>
      <InviteModal />
      <MoveProjectModal />
      <SnackbarUI />
      <RemoveProjectModal />
    </>
  );
};

export default EditProject;
