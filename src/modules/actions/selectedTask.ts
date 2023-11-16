import { createAction } from 'redux-act';

export const selectTask = createAction<string>('selectTask');
export const clearSelectedTask = createAction('clearSelectedTask');
