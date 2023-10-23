export interface IComment {
  taskId?: string;
  transactionId?: string;
  id: string;
  name: string;
  text: string;
  timestamp: string;
  userId: string;
  mentions: string[];
  parentId?: string;
}

export interface Project {
  _id: string;
  projectName?: string;
  description?: string;
  logoUrl?: string;
  creator: string;
  status?: string;
  comments?: IComment[];
  subProjects: SubProject[];
  timestamp: string;
  [key: string]: any;
}

export interface SubProject extends Project {}

export interface IUserProject extends Project {}

export interface ISubProjectAction {
  projectId: string;
  newOrder: Project[];
  subProjectIndex: string;
}

export interface IFile {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
}
