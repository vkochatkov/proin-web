import { createReducer } from 'redux-act';
import { endLoading, startLoading } from '../../actions/loading';

const initialState = false;

export const loadingReducer = createReducer({}, initialState);

loadingReducer.on(startLoading, () => {
  return true;
});

loadingReducer.on(endLoading, () => false);
