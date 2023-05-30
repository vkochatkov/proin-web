import { createReducer } from 'redux-act';
import { clearDraggingStatus, setIsDragging } from '../../actions/dragging';

const initialState = false;

export const dragging = createReducer({}, initialState);

dragging.on(setIsDragging, (_, payload) => payload);
dragging.on(clearDraggingStatus, () => initialState);
