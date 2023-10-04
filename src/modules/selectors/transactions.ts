import { RootState } from '../store/store';

export const getProjectTransactions = (state: RootState) =>
  state.projectTransactions;
export const getUserTransactions = (state: RootState) => state.userTransactions;
