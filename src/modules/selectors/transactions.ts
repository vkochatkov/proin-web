import { RootState } from '../store/store';
import { createSelector } from 'reselect';

const selectRawData = (state: RootState) => state.projectTransactions;

// Create a memoized selector
export const getProjectTransactions = createSelector(
  [selectRawData],
  (rawData) => rawData,
);

export const getUserTransactions = (state: RootState) => state.userTransactions;
