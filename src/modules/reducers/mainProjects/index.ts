import { createReducer } from 'redux-act';
import {
  clearCurrentProject,
  editProjectFailure,
  editProjectSuccess,
  updateProjects,
  clearProjects,
  createProjectSuccess,
} from '../../actions/mainProjects';

export interface Project {
  _id: string;
  projectName?: string;
  description?: string;
  logoUrl?: string;
  creator: string;
  status?: string;
  [key: string]: any;
}

const initialState: {
  projects: Project[];
  currentProject: Project | null;
} = {
  projects: [],
  currentProject: null,
};

export const mainProjects = createReducer({}, initialState);

mainProjects.on(createProjectSuccess, (state, payload) => ({
  ...state,
  currentProject: { ...payload, status: 'success' },
}));

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

mainProjects.on(clearCurrentProject, (state) => {
  return {
    ...state,
    currentProject: initialState.currentProject,
  };
});

mainProjects.on(updateProjects, (state: any, payload: Project[]) => {
  return {
    ...state,
    projects: payload,
  };
});

mainProjects.on(clearProjects, (state) => {
  return {
    ...state,
    projects: initialState.projects,
  };
});
