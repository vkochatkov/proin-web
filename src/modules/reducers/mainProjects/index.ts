import { createReducer } from 'redux-act';
import {
  editProjectFailure,
  editProjectSuccess,
  updateProjects,
} from '../../actions/mainProjects';

export interface Project {
  _id: string;
  projectName?: string;
  description?: string;
  logoUrl?: string;
  creator: string;
  status?: string;
}

const initialState: {
  projects: Project[];
  currentProject: Project | null;
} = {
  projects: [],
  currentProject: null,
};

export const mainProjects = createReducer({}, initialState);

mainProjects.on(editProjectSuccess, (state: any, payload: any) => {
  return { ...state, currentProject: { ...payload, status: 'success' } };
});

mainProjects.on(editProjectFailure, (state: any, payload: any) => {
  return {
    ...state,
    currentProject: {
      status: 'failure',
      error: payload.message,
    },
  };
});

mainProjects.on(updateProjects, (state: any, payload: Project[]) => {
  return {
    ...state,
    projects: payload,
  };
});
