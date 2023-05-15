import { createAction } from 'redux-act';

export const startLoading = createAction('START_LOADING');
export const endLoading = createAction('END_LOADING');
export const startFilesLoading = createAction('START_FILES_LOADING');
export const endFilesLoading = createAction('END_FILES_LOADING');
