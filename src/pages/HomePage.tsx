import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  acceptInvitation,
  fetchProjects,
} from '../modules/actions/mainProjects';
import { startLoading } from '../modules/actions/loading';
import { SnackbarUI } from '../components/UIElements/SnackbarUI';
import { MoveProjectModal } from '../components/Modals/MoveProjectModal';
import { useAuth } from '../hooks/useAuth';
import { RemoveProjectModal } from '../components/Modals/RemoveProjectModal';
import { fetchAllUserTasks } from '../modules/actions/tasks';
import { fetchUserTransactions } from '../modules/actions/transactions';
import { MainProjects } from '../components/MainProjects';

import '../index.scss';

const HomePage: React.FC = () => {
  const { userId } = useAuth();
  const dispatch = useDispatch();

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
    dispatch(fetchUserTransactions() as any);
  }, [userId, dispatch]);

  return (
    <>
      <MoveProjectModal />
      <RemoveProjectModal />
      <SnackbarUI />
      <div className='container'>
        <MainProjects />
      </div>
    </>
  );
};

export default HomePage;
