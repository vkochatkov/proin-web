import { createReducer } from 'redux-act';
import { setIsDragging } from '../../actions/dragging';

const initialState = false;

export const dragging = createReducer({}, initialState);

dragging.on(setIsDragging, (_, payload) => payload);
