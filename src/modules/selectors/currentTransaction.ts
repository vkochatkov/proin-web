import { RootState } from '../store/store';

export const getCurrentTransaction = (state: RootState) =>
  state.currentTransaction;
export const getCurrentTransactionId = (state: RootState) =>
  state.currentTransaction.id;