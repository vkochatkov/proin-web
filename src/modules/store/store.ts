import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from '../reducers/user/index';
import { mainProjects } from '../reducers/mainProjects/index';
import { formReducer } from '../reducers/formReducer';
import { loadingReducer } from '../reducers/loading';
import { snackbar } from '../reducers/snackbar';
import { popup } from '../reducers/popup';
import { dragging } from '../reducers/dragging';
import { projectMembers } from '../reducers/projectMembers/intex';
import { foundUsers } from '../reducers/foundUsers';
import { loadState, saveState } from './sessionStorage';

const rootReducer = combineReducers({
  user: userReducer,
  mainProjects,
  formData: formReducer,
  isLoading: loadingReducer,
  snackbar,
  popup,
  dragging,
  projectMembers,
  foundUsers,
});

export type RootState = ReturnType<typeof rootReducer>;

const persistedState = loadState();
export const store = configureStore({
  reducer: rootReducer,
  preloadedState: loadState(), // Load the state from sessionStorag
});

store.subscribe(() => {
  saveState(store.getState());
});
