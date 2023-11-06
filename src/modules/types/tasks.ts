import { IComment, IFile } from './mainProjects';

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
  comments?: IComment[];
}

export interface ITaskUpdate {
  description: string;
  files: IFile[];
  projectId?: string;
  status: string;
  userId: string;
  _id: string;
  timestamp: string;
  name: string;
  taskId: string;
  actions?: IAction[];
  comments?: IComment[];
}

export interface ITaskRequest extends ITask {
  comment: IComment;
}

export interface ITasks {
  tasks: ITask[];
}

export interface IStatusLabels {
  [key: string]: string;
}
