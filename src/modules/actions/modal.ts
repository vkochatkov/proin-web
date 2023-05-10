import { createAction } from 'redux-act';

export const openModal = createAction<{ id: string }>('OPEN_MODAL');
export const closeModal = createAction<{ id: string }>('CLOSE_MODAL');
