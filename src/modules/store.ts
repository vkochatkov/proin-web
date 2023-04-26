import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './reducers/user/index';
import { mainProjects } from './reducers/mainProjects/index';
import { formReducer } from './reducers/formReducer';
import { loadingReducer } from './reducers/loading';
import { snackbar } from './reducers/snackbar';
import { popup } from './reducers/popup';
import { dragging } from './reducers/dragging';

const rootReducer = combineReducers({
  user: userReducer,
  mainProjects,
  formData: formReducer,
  isLoading: loadingReducer,
  snackbar,
  popup,
  dragging,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({ reducer: rootReducer });
