import { createAction } from 'redux-act';

export const openModal = createAction<{ id: string }>('openModal');
export const closeModal = createAction<{ id: string }>('closeModal');
