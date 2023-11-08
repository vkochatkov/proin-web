import { createReducer } from 'redux-act';
import {
  clearCurrentProject,
  editProjectFailure,
  setCurrentProject,
  updateProjectsSuccess,
  clearProjects,
  createProjectSuccess,
  updateMainProjectsSuccess,
  setAllUserProjects,
  selectItemId,
  updateProjectFiles,
  updateProjectTasks,
} from '../../actions/mainProjects';
import { IUserProject, Project } from '../../types/mainProjects';

const initialState: {
  projects: Project[];
  currentProject: Project | null;
  allUserProjects: IUserProject[] | [];
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

mainProjects.on(updateProjectsSuccess, (state, payload: Project[]) => {
  return {
    ...state,
    projects: payload,
  };
});

mainProjects.on(setAllUserProjects, (state, payload) => ({
  ...state,
  allUserProjects: payload,
}));

mainProjects.on(selectItemId, (state, payload) => ({
  ...state,
  selectedProject: payload,
}));

mainProjects.on(clearProjects, (state) => {
  return {
    ...state,
    projects: initialState.projects,
  };
});

mainProjects.on(updateProjectTasks, (state, payload) => {
  const { oldProject, newProject } = payload;
  const updatedProjects = JSON.parse(JSON.stringify(state.projects));

  updatedProjects.forEach((project: Project) => {
    if (oldProject && oldProject._id === project._id) {
      project.tasks = oldProject.tasks;
    }

    if (newProject._id === project._id) {
      project.tasks = newProject.tasks;
    }
  });

  return {
    ...state,
    projects: updatedProjects,
  };
});
