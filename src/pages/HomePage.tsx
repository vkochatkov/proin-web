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
import { fetchAllUserTasks } from '../modules/actions/tasks';
import { fetchUserTransactions } from '../modules/actions/transactions';
import AddIcon from '@mui/icons-material/Add';
import { PROJECTS_PATH } from '../config/routes';

import './HomePage.scss';

const HomePage: React.FC = () => {
  const { sendRequest } = useHttpClient();
  const { projects, currentProject } = useSelector(
    (state: RootState) => state.mainProjects,
  );
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const dispatch = useDispatch();
  const isLoading = useSelector(getIsLoading);

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
    dispatch(fetchAllUserTasks() as any);
    dispatch(fetchAllUserProjects() as any);
    dispatch(fetchUserTransactions() as any);
    dispatch(endLoading());
  }, [sendRequest, userId, dispatch]);

  useEffect(() => {
    if (isPressed && currentProject && currentProject.status === 'success') {
      navigate(`${PROJECTS_PATH}/${currentProject._id}`);
      setIsPressed(false);
    }
  }, [currentProject, isPressed, navigate]);

  const handleCreateProject = () => {
    setIsPressed(true);
    dispatch(createNewProject() as any);
    dispatch(startLoading());
  };

  const handleClickItem = (id: string) => {
    dispatch(startLoading());
    dispatch(openCurrentProject(id) as any);
    dispatch(selectProject(id));
    navigate(`${PROJECTS_PATH}/${id}`);
  };

  const handleUpdateProjectOrder = (items: Project[]) => {
    dispatch(updateOrderProjects(items) as any);
  };

  return (
    <>
      <MoveProjectModal />
      <RemoveProjectModal />
      <SnackbarUI />
      <div className='container'>
        <Button transparent icon onClick={handleCreateProject}>
          <AddIcon />
        </Button>

        {isLoading && (
          <div className='loading'>
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
