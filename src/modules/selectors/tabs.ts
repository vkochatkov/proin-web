import { RootState } from '../store/store';
import { ITab } from '../types/tabs';
import { createSelector } from 'reselect';

export const getTabsState = (state: RootState) => state.tabs;

export const getValueByTabId = createSelector(
  getTabsState,
  (tabs: ITab) => (tabId: string) => tabs[tabId]
);
