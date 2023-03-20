import { createReducer } from 'redux-act';
import { addProject, updateProjects } from '../../actions/mainProjects';

interface Project {
  id: number;
  name: string;
  description: string;
}

const initialState: Project[] = [];

export const mainProjects = createReducer({}, initialState);

mainProjects.on(addProject, (state: any, payload: Project) => {
  return {
    ...state,
    projects: state.projects.concat([payload]),
  };
});

mainProjects.on(updateProjects, (state: any, payload: Project[]) => {
  return {
    ...state,
    projects: [...payload],
  };
});
