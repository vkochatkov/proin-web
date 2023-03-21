import { createAction } from 'redux-act';
import { Project } from '../reducers/mainProjects';

export const addProject = createAction('ADD_PROJECT');
export const updateProjects = createAction<Project[]>('UPDATE_PROJECTS');
