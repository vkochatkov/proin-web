import { RootState } from '../store/store';
import { createSelector } from 'reselect';

export const getTasks = (state: RootState) => state.projectTasks;
export const getTask = createSelector(
  getTasks,
  (tasks) => (id: string) => tasks.find((task) => task._id === id)
);
