import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from '../reducers/user/index';
import { mainProjects } from '../reducers/mainProjects/index';
import { formReducer } from '../reducers/formReducer';
import { loadingReducer } from '../reducers/loading';
import { snackbar } from '../reducers/snackbar';
import { modal } from '../reducers/modal';
import { dragging } from '../reducers/dragging';
import { projectMembers } from '../reducers/projectMembers/intex';
import { foundUsers } from '../reducers/foundUsers';
import { loadState, saveState } from './sessionStorage';
import { tasks } from '../reducers/currentProjectTasks';
import { input } from '../reducers/input';
import { currentTask } from '../reducers/currentTask';
import { selectedTask } from '../reducers/selectedTask';

const rootReducer = combineReducers({
  user: userReducer,
  mainProjects,
  formData: formReducer,
  isLoading: loadingReducer,
  snackbar,
  modal,
  dragging,
  projectMembers,
  foundUsers,
  currentProjectTasks: tasks,
  input,
  currentTask,
  selectedTask,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadState(), // Load the state from sessionStorag
});

store.subscribe(() => {
  saveState(store.getState());
});
