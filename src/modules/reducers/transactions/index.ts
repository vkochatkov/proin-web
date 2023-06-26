import { createReducer } from 'redux-act';
import { fetchProjectTransactionsSuccess } from '../../actions/transactions';
import { ITransaction } from '../../types/transactions';

const initialState: ITransaction[] = [];

export const transactions = createReducer({}, initialState);

export const projectTransactions = createReducer({}, initialState);

projectTransactions
  .on(fetchProjectTransactionsSuccess, (_, payload) => (payload.transactions));