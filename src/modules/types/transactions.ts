import { IComment, IFile } from './mainProjects';

export interface IClassifiers {
  [key: string]: string[];
}

export interface ITransaction {
  files: IFile[];
  description: string;
  projectId: string;
  userId: string;
  sum: number | null;
  classifier: string;
  id: string;
  timestamp: string;
  type: string;
  classifiers: IClassifiers;
  comments: IComment[];
  // [key: string]: string;
}
