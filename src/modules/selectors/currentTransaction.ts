import { RootState } from '../store/store';

export const getCurrentTransaction = (state: RootState) =>
  state.currentTransaction;
