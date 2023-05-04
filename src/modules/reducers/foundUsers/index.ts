import { createReducer } from 'redux-act';
import { foundUsersSuccess } from '../../actions/foundUsers';
import { IFoundUser } from '../../types/users';

const initialState: IFoundUser[] | [] = [];

export const foundUsers = createReducer({}, initialState);

foundUsers.on(foundUsersSuccess, (_, payload) => payload.foundUsers);
