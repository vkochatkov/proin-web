import { RootState } from '../store';

export const getCurrentProject = (state: RootState) => {
  return state.mainProjects.currentProject;
};
