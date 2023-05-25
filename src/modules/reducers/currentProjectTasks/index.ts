import { createReducer } from 'redux-act';
import {
  clearTasks,
  fetchTasksSuccess,
  updateTasksOrderSuccess,
} from '../../actions/currentProjectTasks';
import { ITask } from '../../types/currentProjectTasks';

const initialState: ITask[] | undefined = [];

export const tasks = createReducer({}, initialState);

tasks.on(fetchTasksSuccess, (_, payload) => {
  return payload.tasks;
});

tasks.on(updateTasksOrderSuccess, (_, payload) => {
  return payload.tasks;
});

tasks.on(clearTasks, () => initialState);
