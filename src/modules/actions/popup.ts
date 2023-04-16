import { createAction } from 'redux-act';

export const openPopup = createAction<{ id: string }>('OPEN_POPUP');
export const closePopup = createAction<{ id: string }>('CLOSE_POPUP');
