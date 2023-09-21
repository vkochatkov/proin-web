import { RootState } from '../store/store';
import { createSelector } from 'reselect';

export const getCurrentProject = (state: RootState) => {
  return state.mainProjects.currentProject;
};

export const getCurrentProjectId = (state: RootState) => {
  const currentProject = state.mainProjects.currentProject;

  return currentProject ? currentProject.id : '';
};

export const getCurrentProjects = (state: RootState) =>
  state.mainProjects.projects;

export const getAllUserProjects = (state: RootState) =>
  state.mainProjects.allUserProjects;

export const getCurrentUserProject = createSelector(
  getAllUserProjects,
  (projects) => (id: string) => projects.find((project) => project._id === id),
);

export const getSelectedProjectId = (state: RootState) =>
  state.mainProjects.selectedProject;
