import { createReducer } from 'redux-act';
import {
  clearProjectTransactions,
  clearUserTransactions,
  fetchProjectTransactionsSuccess,
  fetchUserTransactionsSuccess,
  updateProjectTransactionsSuccess,
  updateUserTransactionsSuccess
} from '../../actions/transactions';
import { ITransaction } from '../../types/transactions';

const initialState: ITransaction[] = [];

export const userTransactions = createReducer({}, initialState);

userTransactions.on(updateUserTransactionsSuccess, (_, payload) => payload.transactions);
userTransactions.on(fetchUserTransactionsSuccess, (_, payload) => payload.transactions);
userTransactions.on(clearUserTransactions, () => []);

export const projectTransactions = createReducer({}, initialState);

projectTransactions
  .on(fetchProjectTransactionsSuccess, (_, payload) => (payload.transactions));

projectTransactions.on(updateProjectTransactionsSuccess, (_, payload) => payload.transactions);
projectTransactions.on(clearProjectTransactions, () => []);
