import { createReducer } from 'redux-act';
import {
  clearProjectMembers,
  fetchMembersSuccess,
  removeProjectMemberSuccess,
} from '../../actions/projectMembers';
import { IMember } from '../../types/projectMembers';

const initialState: IMember[] = [];

export const projectMembers = createReducer<IMember[]>({}, initialState);

projectMembers.on(fetchMembersSuccess, (_, payload) => payload.projectMembers);
projectMembers.on(removeProjectMemberSuccess, (_, payload) => payload.members);
projectMembers.on(clearProjectMembers, () => initialState);
