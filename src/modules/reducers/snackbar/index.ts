import { AlertColor } from '@mui/material';
import { createReducer } from 'redux-act';
import {
  changeSnackbarState,
  clearSnackbarState,
} from '../../actions/snackbar';

interface Snackbar {
  id: AlertColor;
  open: boolean;
  message: string;
}

const initialState: Snackbar = {
  id: 'success',
  open: false,
  message: '',
};

export const snackbar = createReducer({}, initialState);

snackbar.on(changeSnackbarState, (state, payload) => {
  return {
    ...state,
    ...payload,
  };
});

snackbar.on(clearSnackbarState, () => initialState);
