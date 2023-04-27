import { Project } from '../reducers/mainProjects';

export interface IProject {
  projectName: string;
  _id: string;
  subProjects: string[];
}

export interface ISubProjectAction {
  projectId: string;
  newOrder: Project[];
  subProjectIndex: string;
}
