import { createSelector } from 'reselect';
import { RootState } from '../store/store';

export const getPopupState = (state: RootState) => state.popup;
export const getPopupStateById = createSelector(
  getPopupState,
  (popup) => (id: string) => {
    return popup[id] || false;
  }
);
