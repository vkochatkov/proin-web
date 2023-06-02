import { ITab } from '../../types/tabs';
import { createReducer } from 'redux-act';
import { setDefaultTabValue, setTabValue } from '../../actions/tabs';

const initialState: ITab = {
  ['main-tabs']: 'Опис',
  ['comment-tabs']: 'Коментарі',
};

export const tabs = createReducer({}, initialState);

tabs.on(setTabValue, (state, payload) => ({
  ...state,
  ...payload,
}));

tabs.on(setDefaultTabValue, () => initialState);
