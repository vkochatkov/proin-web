import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHttpClient } from '../hooks/useHttpClient';
import {
  acceptInvitation,
  createNewProject,
  fetchAllUserProjects,
  fetchProjects,
  openCurrentProject,
  selectProject,
  updateOrderProjects,
} from '../modules/actions/mainProjects';
import { LoadingSpinner } from '../components/UIElements/LoadingSpinner';
import { RootState } from '../modules/store/store';
import { ListProjectItem } from '../components/ListProjectItem';
import { MainNavigation } from '../components/Navigation/MainNavigation';
import { Button } from '../components/FormElement/Button';
import { useNavigate } from 'react-router-dom';
import { getIsLoading } from '../modules/selectors/loading';
import { endLoading, startLoading } from '../modules/actions/loading';
import { SnackbarUI } from '../components/UIElements/SnackbarUI';
import { Project } from '../modules/reducers/mainProjects';
import { MoveProjectModal } from '../components/Modals/MoveProjectModal';
import { useAuth } from '../hooks/useAuth';
import { RemoveProjectModal } from '../components/Modals/RemoveProjectModal';
import { clearDraggingStatus } from '../modules/actions/dragging';

import './HomePage.scss';

const HomePage: React.FC = () => {
  const { sendRequest } = useHttpClient();
  const { projects, currentProject } = useSelector(
    (state: RootState) => state.mainProjects
  );
  const { userId, token } = useAuth();
  const navigate = useNavigate();
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoading);

  useEffect(() => {
    return () => {
      dispatch(clearDraggingStatus());
    };
  }, [dispatch]);

  useEffect(() => {
    const storedDataString = localStorage.getItem('accessInfo');

    dispatch(startLoading());

    if (storedDataString) {
      const storedData = JSON.parse(storedDataString);

      dispatch(acceptInvitation(storedData) as any);
      localStorage.removeItem('accessInfo');
    }
  }, [dispatch]);

  useEffect(() => {
    if (!userId) return;

    dispatch(fetchProjects() as any);
    dispatch(fetchAllUserProjects() as any);
    dispatch(endLoading());
  }, [sendRequest, userId, dispatch]);

  useEffect(() => {
    if (isPressed && currentProject && currentProject.status === 'success') {
      navigate(`/project-edit/${currentProject._id}`);
      setIsPressed(false);
    }
  }, [currentProject, isPressed, navigate]);

  const handleCreateProject = () => {
    setIsPressed(true);
    dispatch(createNewProject(token) as any);
    dispatch(startLoading());
  };

  const handleClickItem = (id: string) => {
    dispatch(startLoading());
    dispatch(openCurrentProject(id) as any);
    dispatch(selectProject(id));
    navigate(`/project-edit/${id}`);
  };

  const handleUpdateProjectOrder = (items: Project[]) => {
    dispatch(updateOrderProjects(items) as any);
  };

  return (
    <>
      <MoveProjectModal />
      <RemoveProjectModal />
      <SnackbarUI />
      <div className="container">
        <MainNavigation>
          <Button
            size="small"
            transparent={true}
            icon={true}
            onClick={handleCreateProject}
          >
            <img
              src="/plus_icon.svg"
              className="button__icon"
              alt="button icon"
            />
          </Button>
        </MainNavigation>
        {isLoading && (
          <div className="loading">
            <LoadingSpinner />
          </div>
        )}
        {!isLoading && (
          <ListProjectItem
            projects={projects}
            onClick={handleClickItem}
            updateOrder={handleUpdateProjectOrder}
            isWrapped
          />
        )}
      </div>
    </>
  );
};

export default HomePage;
