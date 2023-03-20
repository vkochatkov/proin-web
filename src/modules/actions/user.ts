import { createAction } from 'redux-act';
import { UserState } from '../reducers/user';

export const updateLogin = createAction<UserState>('LOGIN');
