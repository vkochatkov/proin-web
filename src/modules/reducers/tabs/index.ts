import { ITab } from '../../types/tabs';
import { createReducer } from 'redux-act';
import { setTabValue } from '../../actions/tabs';

const initialState: ITab = {};

export const tabs = createReducer({}, initialState);

tabs.on(setTabValue, (state, payload) => ({
  ...state,
  ...payload,
}));
