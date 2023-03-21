import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useHttpClient } from '../hooks/http-hook';
import { useHttpClient } from '../hooks/useHttpClient';
import { updateProjects } from '../modules/actions/mainProjects';
import { LoadingSpinner } from '../components/UIElements/LoadingSpinner';
import { RootState } from '../modules/store';
import { ListItems } from '../components/ListItems';
import { MainNavigation } from '../components/Navigation/MainNavigation';
import { Button } from '../components/FormElement/Button';
import './HomePage.scss';

export const HomePage: React.FC = () => {
  const { sendRequest, isLoading } = useHttpClient();
  const projects = useSelector((state: RootState) => state.mainProjects);
  const { userId } = useSelector((state: RootState) => state.user);
  // const [isPressed, setIsPressed] = useState<boolean>(false);
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

  const handleClick = () => {
    // navigation.navigate('Form');
  };

  return (
    <>
      <div className="home-page__container">
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
