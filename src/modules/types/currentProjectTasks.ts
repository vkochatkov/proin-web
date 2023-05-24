import { IFile } from './mainProjects';

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
  // [key: string]: string
}

export interface ITasks {
  tasks: ITask[];
}
