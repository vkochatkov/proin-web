import { createReducer } from 'redux-act';
import {
  chooseCurrentTaskSuccess,
  updateCurrentTaskDiarySuccess,
  updateCurrentTaskSuccess,
  updateTaskState,
} from '../../actions/currentTask';
import { ITask } from '../../types/tasks';

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

currentTask.on(updateCurrentTaskSuccess, (state, payload) => ({
  ...state,
  ...payload.task,
}));
currentTask.on(updateCurrentTaskDiarySuccess, (state, { actions }) => ({
  ...state,
  actions
}))
currentTask.on(updateTaskState, (state, payload) => ({
  ...state,
  ...payload.task,
}));
