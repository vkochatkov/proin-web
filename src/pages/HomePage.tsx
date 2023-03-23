import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHttpClient } from '../hooks/useHttpClient';
import { editProject, updateProjects } from '../modules/actions/mainProjects';
import { LoadingSpinner } from '../components/UIElements/LoadingSpinner';
import { RootState } from '../modules/store';
import { ListItems } from '../components/ListItems';
import { MainNavigation } from '../components/Navigation/MainNavigation';
import { Button } from '../components/FormElement/Button';
import { useNavigate } from 'react-router-dom';
import './HomePage.scss';

export const HomePage: React.FC = () => {
  const { sendRequest, isLoading } = useHttpClient();
  const { projects, currentProject } = useSelector(
    (state: RootState) => state.mainProjects
  );
  const { userId, token } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await sendRequest(
        `http://localhost:5000/projects/user/${userId}`
      );
      dispatch(updateProjects(res.projects));
    };
    fetchProjects();
  }, [sendRequest, userId, dispatch]);

  useEffect(() => {
    if (isPressed && currentProject && currentProject.status === 'success') {
      navigate(`/project-edit/${currentProject._id}`);
      setIsPressed(false);
    }
  }, [currentProject, isPressed, navigate]);

  const handleClick = () => {
    setIsPressed(true);
    dispatch(editProject(token) as any);
  };

  return (
    <>
      <div className="container">
        <MainNavigation>
          <Button
            size="small"
            transparent={true}
            icon={true}
            onClick={handleClick}
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
