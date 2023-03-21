import { createReducer } from 'redux-act';
import { addProject, updateProjects } from '../../actions/mainProjects';

export interface Project {
  id: number;
  projectName: string;
  description: string;
  logoUrl: string;
}

const initialState: Project[] = [];

export const mainProjects = createReducer({}, initialState);

mainProjects.on(addProject, (state: any, payload: Project[]) => {
  return [...state, ...payload];
});

mainProjects.on(updateProjects, (state: any, payload: Project[]) => {
  return [...state, ...payload];
});
