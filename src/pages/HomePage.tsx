import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHttpClient } from '../hooks/useHttpClient';
import {
  acceptInvitation,
  createNewProject,
  updateProjects,
} from '../modules/actions/mainProjects';
import { LoadingSpinner } from '../components/UIElements/LoadingSpinner';
import { RootState } from '../modules/store';
import { ListItems } from '../components/ListItems';
import { MainNavigation } from '../components/Navigation/MainNavigation';
import { Button } from '../components/FormElement/Button';
import { useNavigate } from 'react-router-dom';
import { getIsLoading } from '../modules/selectors/loading';
import { endLoading, startLoading } from '../modules/actions/loading';
import { SnackbarUI } from '../components/UIElements/SnackbarUI';

import './HomePage.scss';

const HomePage: React.FC = () => {
  const { sendRequest } = useHttpClient();
  const { projects, currentProject } = useSelector(
    (state: RootState) => state.mainProjects
  );
  const { userId, token } = useSelector((state: RootState) => state.user);
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
    const fetchProjects = async () => {
      const res = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/projects/user/${userId}`
      );
      dispatch(updateProjects(res.projects));
      dispatch(endLoading());
    };
    fetchProjects();
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

  return (
    <>
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
        {!isLoading && <ListItems projects={projects} />}
      </div>
    </>
  );
};

export default HomePage;
