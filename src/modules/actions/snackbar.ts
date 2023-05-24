import { AlertColor } from '@mui/material';
import { createAction } from 'redux-act';

export const changeSnackbarState = createAction<{
  message: string;
  open: boolean;
  id: AlertColor;
}>('changeSnackbarState');

export const clearSnackbarState = createAction('clearSnackbarState');
