export interface IComment {
  taskId?: string;
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
  subProjects: Project[];
  [key: string]: any;
}

export interface IProject {
  projectName: string;
  _id: string;
  subProjects: Project[];
  classifier: string[];
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
