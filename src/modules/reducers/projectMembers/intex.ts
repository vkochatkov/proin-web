import { createReducer } from 'redux-act';
import { fetchMembersSuccess } from '../../actions/projectMembers';
import { IMember } from '../../types/projectMembers';

const initialState: IMember[] = [];

export const projectMembers = createReducer({}, initialState);

projectMembers.on(fetchMembersSuccess, (_, payload) => payload.projectMembers);
