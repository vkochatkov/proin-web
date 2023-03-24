import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';

// import reduxThunk from 'redux-thunk';
import { userReducer } from './reducers/user/index';
import { mainProjects } from './reducers/mainProjects/index';
import { formReducer } from './reducers/formReducer';
import { loadingReducer } from './reducers/loading';

const rootReducer = combineReducers({
  user: userReducer,
  mainProjects,
  formData: formReducer,
  isLoading: loadingReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export const store = configureStore({ reducer: rootReducer });
