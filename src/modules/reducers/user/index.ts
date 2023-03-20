import { createReducer } from 'redux-act';
import { updateLogin } from '../../actions/user';

export interface UserState {
  userId: string;
  email?: string;
  token: string;
}

const initialState: UserState = {
  userId: '',
  email: '',
  token: '',
};

export const userReducer = createReducer({}, initialState);

userReducer.on(updateLogin, (state: UserState, payload: UserState) => {
  return {
    ...state,
    ...payload,
  };
});
