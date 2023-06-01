import { createReducer } from 'redux-act';
import { selectTask } from '../../actions/selectedTask';

const initialState = '';

export const selectedTask = createReducer({}, initialState);

selectedTask.on(selectTask, (_, payload) => payload);
