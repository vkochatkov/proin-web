import { createReducer } from 'redux-act';
import { closeModal, openModal } from '../../actions/modal';

interface IPopup {
  [id: string]: boolean;
}

const initialState: IPopup = {};

export const modal = createReducer({}, initialState);

modal.on(openModal, (state, payload) => {
  return {
    ...state,
    [payload.id]: true,
  };
});

modal.on(closeModal, (state, payload) => {
  return {
    ...state,
    [payload.id]: false,
  };
});
