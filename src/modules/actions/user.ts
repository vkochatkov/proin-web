import { createAction } from 'redux-act';
import { UserState } from '../reducers/user';
import { endLoading } from './loading';

export const loginSuccess = createAction<UserState>('LOGIN_SUCCESS');
export const logoutSuccess = createAction('LOGOUT_SUCCESS');

export const signin = (uid: string, token: string) => (dispatch: any) => {
  dispatch(
    loginSuccess({
      userId: uid,
      token,
    })
  );
  dispatch(endLoading());
};

export const signout = () => (dispatch: any) => {
  dispatch(logoutSuccess());
  dispatch(endLoading());
};
