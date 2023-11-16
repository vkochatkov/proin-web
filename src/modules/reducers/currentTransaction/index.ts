import { createReducer } from 'redux-act';
import {
  clearCurrentTransaction,
  setCurrentTransaction,
} from '../../actions/transactions';
import { IClassifiers, ITransaction } from '../../types/transactions';

const initialClassifiers: IClassifiers = {
  expenses: [],
  income: [],
  transfer: [],
};

const initialState: ITransaction = {
  description: '',
  projectId: '',
  userId: '',
  sum: null,
  classifier: '',
  id: '',
  type: 'expenses',
  timestamp: '',
  classifiers: initialClassifiers,
  files: [],
  comments: [],
};

export const currentTransaction = createReducer({}, initialState);

currentTransaction.on(setCurrentTransaction, (_, payload) => ({
  ...payload,
}));
currentTransaction.on(clearCurrentTransaction, () => initialState);
