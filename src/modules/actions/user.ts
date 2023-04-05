import axios from 'axios';
import { Dispatch } from 'redux';
import { createAction } from 'redux-act';
import { UserState } from '../reducers/user';
import { RootState } from '../store';
import { clearFormInput } from './form';
import { endLoading } from './loading';

export const loginSuccess = createAction<UserState>('LOGIN_SUCCESS');
export const logoutSuccess = createAction('LOGOUT_SUCCESS');

const httpSource = axios.CancelToken.source();

export const signin = (uid: string, token: string) => (dispatch: Dispatch) => {
  dispatch(
    loginSuccess({
      userId: uid,
      token,
    })
  );
  dispatch(endLoading());
};

export const signout = () => (dispatch: Dispatch) => {
  dispatch(logoutSuccess());
  dispatch(endLoading());
};

export const sendRecaveryEmail =
  () => async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const { inputs } = getState().formData;

      const res = await axios({
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

      if (res.data) {
        dispatch(clearFormInput());
      }
    } catch (e: any) {
      console.log(e.message);
    }
  };

export const resetPassword =
  (token: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const { inputs } = getState().formData;

      const res = await axios({
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

      console.log('res', res);
      window.location.href = '/';
    } catch (e) {
      console.log(e);
    }
  };
