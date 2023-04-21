import { createReducer } from 'redux-act';
import { loginSuccess, logoutSuccess } from '../../actions/user';

export interface UserState {
  userId: string;
  token: string;
  email: string;
  name: string;
}

const initialState: UserState = {
  userId: '',
  token: '',
  email: '',
  name: '',
};

export const userReducer = createReducer({}, initialState);

userReducer.on(loginSuccess, (state: UserState, payload: UserState) => {
  return {
    ...state,
    ...payload,
  };
});

userReducer.on(logoutSuccess, () => initialState);
