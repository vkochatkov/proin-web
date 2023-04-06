import { AlertColor } from '@mui/material';
import { createAction } from 'redux-act';

export const changeSnackbarState = createAction<{
  message: string;
  open: boolean;
  id: AlertColor;
}>('CHANGE_SNACKBAR_STATE');

export const clearSnackbarState = createAction('CLEAR_SNACKBAR_STATE');
