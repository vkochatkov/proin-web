import { createReducer } from 'redux-act';
import {
  chooseCurrentTaskSuccess,
  updateCurrentTaskSuccess,
  updateTaskState,
} from '../../actions/currentTask';
import { ITask } from '../../types/currentProjectTasks';

const initialState: ITask = {
  description: '',
  files: [],
  projectId: '',
  status: '',
  userId: '',
  _id: '',
  timestamp: '',
  name: '',
  taskId: '',
};

export const currentTask = createReducer({}, initialState);

currentTask.on(chooseCurrentTaskSuccess, (_, payload) => {
  return payload.task;
});

currentTask.on(updateCurrentTaskSuccess, (_, payload) => payload.task);
currentTask.on(updateTaskState, (_, payload) => payload.task);
