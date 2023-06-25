export interface ITransaction {
  description: string;
  projectId: string;
  userId: string;
  sum: number;
  classifier: string;
  id: string;
  timestamp: string;
  type: string;
  // [key: string]: string;
}
