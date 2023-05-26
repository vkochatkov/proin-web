import { createAction } from 'redux-act';

export const setIsActiveInput = createAction<boolean>('setIsActiveInput');
export const clearInputState = createAction('clearInputState');
