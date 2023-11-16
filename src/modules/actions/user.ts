import axios from 'axios';
import { Dispatch } from 'redux';
import { createAction } from 'redux-act';
import { PROJECTS_PATH } from '../../config/routes';
import { APIClient } from '../../utils/API';
import { UserState } from '../reducers/user';
import { RootState } from '../store/store';
import { clearFormInput } from './form';
import { endLoading } from './loading';
import { changeSnackbarState, clearSnackbarState } from './snackbar';
import { clearMainProjects } from './mainProjects';
import { clearProjectMembers } from './projectMembers';
import { clearCurrentTask } from './currentTask';
import { clearUserTasks } from './userTasks';
import { clearCurrentTransaction, clearUserTransactions } from './transactions';

export const loginSuccess = createAction<UserState>('loginSuccess');
export const logoutSuccess = createAction('logoutSuccess');

const httpSource = axios.CancelToken.source();

export const signin =
  (uid: string, token: string, email: string, name: string) =>
  (dispatch: Dispatch) => {
    try {
      APIClient.setToken(token);
      dispatch(
        loginSuccess({
          userId: uid,
          token,
          email,
          name,
        }),
      );
    } catch (e) {
      console.log('signin', e);
    }
  };

export const signout = () => (dispatch: Dispatch) => {
  dispatch(logoutSuccess());
  dispatch(endLoading());
  dispatch(clearMainProjects());
  dispatch(clearProjectMembers());
  dispatch(clearCurrentTask());
  dispatch(clearUserTasks());
  dispatch(clearUserTransactions());
  dispatch(clearCurrentTransaction());

  APIClient.setToken(null);
};

export const sendRecaveryEmail =
  () => async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const { inputs } = getState().formData;

      await axios({
        method: 'POST',
        url: `${process.env.REACT_APP_BACKEND_URL}/users/forgot-password`,
        data: JSON.stringify({
          email: inputs.email.value,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        cancelToken: httpSource.token,
      });

      dispatch(
        changeSnackbarState({
          id: 'success',
          open: true,
          message: 'Лист з інструкціями відправлено на вашу електронну адресу',
        }),
      );

      setTimeout(() => {
        dispatch(clearSnackbarState());
      }, 6000);

      dispatch(clearFormInput());
    } catch (e: any) {
      console.log(e);
    }
  };

export const resetPassword =
  (token: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const { inputs } = getState().formData;

      await axios({
        method: 'POST',
        url: `${process.env.REACT_APP_BACKEND_URL}/users/reset-password`,
        data: JSON.stringify({
          password: inputs.password.value,
          token,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
        cancelToken: httpSource.token,
      });

      dispatch(clearFormInput());
      dispatch(
        changeSnackbarState({
          id: 'success',
          open: true,
          message: 'Пароль успішно змінено',
        }),
      );

      setTimeout(() => {
        window.location.href = PROJECTS_PATH;
      }, 6000);
    } catch (e: any) {
      console.log(e);
    }
  };
