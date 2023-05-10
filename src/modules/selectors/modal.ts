import { createSelector } from 'reselect';
import { RootState } from '../store/store';

export const getModuleState = (state: RootState) => state.modal;
export const getModalStateById = createSelector(
  getModuleState,
  (modal) => (id: string) => modal[id] || false
);
