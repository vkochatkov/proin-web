import { createReducer } from 'redux-act';
import { fetchAllUserTasksSuccess } from '../../actions/tasks';
import { updateUserTasksSuccess } from '../../actions/userTasks';
import { ITask } from '../../types/tasks';

const initialState: ITask[] | undefined = [];

export const userTasks = createReducer({}, initialState);

userTasks.on(fetchAllUserTasksSuccess, (_, payload) => payload.tasks);
userTasks.on(updateUserTasksSuccess, (_, payload) => payload);
