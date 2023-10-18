import { RootState } from '../store/store';
import { createSelector } from 'reselect';
import { IUserProject, Project } from '../types/mainProjects';

export const findProjectById = (
  projectId: string,
  projects: (IUserProject | Project)[],
): IUserProject | Project | undefined => {
  for (const project of projects) {
    if (project._id === projectId) {
      return project;
    }

    if (project.subProjects && project.subProjects.length > 0) {
      const foundProject = findProjectById(projectId, project.subProjects);
      if (foundProject) {
        return foundProject;
      }
    }
  }

  return undefined; // Project not found
};

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
  (projects) => (id: string) => {
    const project = projects.find((p) => p._id === id);

    if (!project) {
      // If the project is not found in top-level projects, search in subProjects
      return findProjectById(id, projects);
    }

    return project;
  },
);

export const getSelectedProjectId = (state: RootState) =>
  state.mainProjects.selectedProject;
