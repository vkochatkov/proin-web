import { createReducer } from 'redux-act';
import { fetchAllUserTasksSuccess } from '../../actions/tasks';
import { ITask } from '../../types/projectTasks';

const initialState: ITask[] | undefined = [];

export const userTasks = createReducer({}, initialState);

userTasks.on(fetchAllUserTasksSuccess, (_, payload) => payload.tasks);
