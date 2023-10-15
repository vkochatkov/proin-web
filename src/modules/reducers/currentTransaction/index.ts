import { createReducer } from 'redux-act';
import { setCurrentTransaction } from '../../actions/transactions';
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
  sum: 0,
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
