import { createReducer } from 'redux-act';
import { ITransaction } from '../../types/transactions';

const initialState: ITransaction = {
  description: '',
  projectId: '',
  userId: '',
  sum: '',
  classifier: '',
  id: '',
  type: '',
  timestamp: '',
};

export const currentTransaction = createReducer({}, initialState);
