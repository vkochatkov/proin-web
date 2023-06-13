import { RootState } from '../store/store';
import { createSelector } from 'reselect';

export const getAllUserTasks = (state: RootState) => state.userTasks;
export const getUserTasks = (state: RootState) => state.userTasks;
export const getUserTask = createSelector(
  getUserTasks,
  (tasks) => (id: string) => tasks.find((task) => task._id === id)
);
