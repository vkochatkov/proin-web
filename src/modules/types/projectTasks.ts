import { IFile } from './mainProjects';

export interface IAction {
  [key: string]: string;
}

export interface ITask {
  description: string;
  files: IFile[];
  projectId: string;
  status: string;
  userId: string;
  _id: string;
  timestamp: string;
  name: string;
  taskId: string;
  actions?: IAction[];
}

export interface ITasks {
  tasks: ITask[];
}

export interface IStatusLabels {
  [key: string]: string;
}
