import { Project } from '../reducers/mainProjects';

export interface IProject {
  projectName: string;
  _id: string;
  subProjects: string[];
  classifier: string[]
}

export interface ISubProjectAction {
  projectId: string;
  newOrder: Project[];
  subProjectIndex: string;
}

export interface IFile {
  id: string;
  name: string;
  url: string;
}
