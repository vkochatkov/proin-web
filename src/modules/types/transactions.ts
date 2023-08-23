export interface IClassifiers {
  [key: string]: string[],
}

export interface ITransaction {
  description: string;
  projectId: string;
  userId: string;
  sum: number;
  classifier: string;
  id: string;
  timestamp: string;
  type: 'expenses' | 'income' | 'transfer';
  classifiers: IClassifiers
  // [key: string]: string;
}
