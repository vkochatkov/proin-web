import { createReducer } from 'redux-act';
import { closePopup, openPopup } from '../../actions/popup';

interface IPopup {
  id: string;
  open: boolean;
}

const initialState: IPopup = {
  id: '',
  open: false,
};

export const popup = createReducer({}, initialState);

popup.on(openPopup, (state, payload) => {
  return {
    ...state,
    id: payload.id,
    open: true,
  };
});

popup.on(closePopup, (state, payload) => {
  return {
    ...state,
    id: payload.id,
    open: false,
  };
});
