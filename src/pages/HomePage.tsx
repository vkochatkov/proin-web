import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useHttpClient } from '../hooks/http-hook';
import { useHttpClient } from '../hooks/useHttpClient';
import { updateProjects } from '../modules/actions/mainProjects';
import { LoadingSpinner } from '../components/UIElements/LoadingSpinner';
import { RootState } from '../modules/store';

export const HomePage: React.FC = () => {
  const { sendRequest, isLoading } = useHttpClient();
  const projects = useSelector((state: RootState) => state.mainProjects);
  const { userId } = useSelector((state: RootState) => state.user);
  const [isPressed, setIsPressed] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await sendRequest(
        `http://localhost:5000/projects/user/${userId}`
      );
      // dispatch(updateProjects(res.projects));
    };
    fetchProjects();
  }, [sendRequest, userId, dispatch]);

  const handlePress = () => {
    // navigation.navigate('Form');
  };

  return (
    <>
      <div>
        {!isLoading && (
          <div>
            {/* <Entypo.Button
              name="plus"
              size={40}
              backgroundColor="transparent"
              onPress={handlePress}
              onPressIn={() => setIsPressed(true)}
              onPressOut={() => setIsPressed(false)}
              style={[isPressed ? styles.buttonPressed : styles.button]}
            /> */}
          </div>
        )}
        {isLoading && <LoadingSpinner />}
        <div>Projects list</div>
        {/* {!isLoading && <ProjectsList projects={projects} />} */}
        <div />
      </div>
    </>
  );
};
