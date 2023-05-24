import { createAction } from 'redux-act';

export const startLoading = createAction('startLoading');
export const endLoading = createAction('endLoading');
export const startFilesLoading = createAction('startFilesLoading');
export const endFilesLoading = createAction('endFilesLoading');
