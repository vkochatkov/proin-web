import { createReducer } from 'redux-act';
import { closePopup, openPopup } from '../../actions/popup';

interface IPopup {
  [id: string]: boolean;
}

const initialState: IPopup = {};

export const popup = createReducer({}, initialState);

popup.on(openPopup, (state, payload) => {
  return {
    ...state,
    [payload.id]: true,
  };
});

popup.on(closePopup, (state, payload) => {
  return {
    ...state,
    [payload.id]: false,
  };
});
