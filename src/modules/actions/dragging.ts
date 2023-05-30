import { createAction } from 'redux-act';

export const setIsDragging = createAction<boolean>('setIsDragging');
export const clearDraggingStatus = createAction('clearDraggingStatus');
