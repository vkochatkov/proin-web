import { createReducer } from 'redux-act';
import { setCurrentTransaction } from '../../actions/transactions';
import { ITransaction } from '../../types/transactions';

const initialState: ITransaction = {
  description: '',
  projectId: '',
  userId: '',
  sum: 0,
  classifier: '',
  id: '',
  type: '',
  timestamp: '',
};

export const currentTransaction = createReducer({}, initialState);

currentTransaction.on(setCurrentTransaction, (state, payload) => ({
  ...state,
  ...payload
}));
