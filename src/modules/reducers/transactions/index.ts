import { createReducer } from 'redux-act';
import { ITransaction } from '../../types/transactions';

const initialState: ITransaction[] = [];

export const transactions = createReducer({}, initialState);
