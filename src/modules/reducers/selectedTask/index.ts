import { createReducer } from 'redux-act';
import { clearSelectedTask, selectTask } from '../../actions/selectedTask';

const initialState = '';

export const selectedTask = createReducer({}, initialState);

selectedTask.on(selectTask, (_, payload) => payload);
selectedTask.on(clearSelectedTask, () => initialState);
