import { createReducer } from 'redux-act';
import {
  clearCurrentProject,
  editProjectFailure,
  setCurrentProject,
  updateProjects,
  clearProjects,
  createProjectSuccess,
  updateMainProjectsSuccess,
  setAllUserProjects,
  selectProject,
  updateProjectFiles,
} from '../../actions/mainProjects';
import { IProject } from '../../types/mainProjects';

export interface IComment {
  id: string;
  name: string;
  text: string;
  timestamp: string;
  userId: string;
  mentions: string[];
}

export interface Project {
  _id: string;
  projectName?: string;
  description?: string;
  logoUrl?: string;
  creator: string;
  status?: string;
  comments?: IComment[];
  [key: string]: any;
}

const initialState: {
  projects: Project[];
  currentProject: Project | null;
  allUserProjects: IProject[] | [];
  selectedProject: string;
} = {
  projects: [],
  currentProject: null,
  allUserProjects: [],
  selectedProject: '',
};

export const mainProjects = createReducer({}, initialState);

mainProjects.on(createProjectSuccess, (state, payload) => ({
  ...state,
  currentProject: { ...payload, status: 'success' },
}));

mainProjects.on(setCurrentProject, (state, payload) => {
  return { ...state, currentProject: { ...payload, status: 'success' } };
});

mainProjects.on(updateProjectFiles, (state, payload) => {
  if (state.currentProject && state.currentProject._id === payload.projectId) {
    const updatedProject = {
      ...state.currentProject,
      files: payload.files,
    };
    return { ...state, currentProject: updatedProject };
  }
  return state;
});

mainProjects.on(editProjectFailure, (state: any, payload: any) => {
  return {
    ...state,
    currentProject: {
      status: 'failure',
      error: payload,
    },
  };
});

mainProjects.on(updateMainProjectsSuccess, (state, payload) => {
  const { updatedCurrentProject, updatedProjectsArray } = payload;

  return {
    ...state,
    currentProject: updatedCurrentProject,
    projects: updatedProjectsArray,
  };
});

mainProjects.on(clearCurrentProject, (state) => {
  return {
    ...state,
    currentProject: initialState.currentProject,
  };
});

mainProjects.on(updateProjects, (state, payload: Project[]) => {
  return {
    ...state,
    projects: payload,
  };
});

mainProjects.on(setAllUserProjects, (state, payload) => ({
  ...state,
  allUserProjects: payload,
}));

mainProjects.on(selectProject, (state, payload) => ({
  ...state,
  selectedProject: payload,
}));

mainProjects.on(clearProjects, (state) => {
  return {
    ...state,
    projects: initialState.projects,
  };
});
