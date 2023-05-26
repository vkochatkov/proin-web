import { createReducer } from 'redux-act';
import { clearInputState, setIsActiveInput } from '../../actions/input';

const initialState = {
  isActiveInput: false,
};

export const input = createReducer({}, initialState);

input.on(setIsActiveInput, (state, payload) => ({
  ...state,
  isActiveInput: payload,
}));

input.on(clearInputState, () => initialState);
