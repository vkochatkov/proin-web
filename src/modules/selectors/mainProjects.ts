import { RootState } from '../store/store';

export const getCurrentProject = (state: RootState) => {
  return state.mainProjects.currentProject;
};

export const getCurrentProjectId = (state: RootState) => {
  const currentProject = state.mainProjects.currentProject;

  return currentProject ? currentProject.id : '';
}

export const getCurrentProjects = (state: RootState) =>
  state.mainProjects.projects;

export const getAllUserProjects = (state: RootState) =>
  state.mainProjects.allUserProjects;

export const getSelectedProjectId = (state: RootState) =>
  state.mainProjects.selectedProject;
