import { createAction } from 'redux-act';

export const setTabValue = createAction<{ [key: string]: string }>(
  'setTabValue'
);
