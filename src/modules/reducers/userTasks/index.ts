import { createReducer } from 'redux-act';
import { fetchAllUserTasksSuccess } from '../../actions/tasks';
import { changeUserTasksOrderSuccess } from '../../actions/userTasks';
import { ITask } from '../../types/projectTasks';

const initialState: ITask[] | undefined = [];

export const userTasks = createReducer({}, initialState);

userTasks.on(fetchAllUserTasksSuccess, (_, payload) => payload.tasks);
userTasks.on(changeUserTasksOrderSuccess, (_, payload) => payload);
