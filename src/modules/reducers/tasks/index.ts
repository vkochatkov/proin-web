import { createReducer } from 'redux-act';
import {
  clearTasks,
  fetchTasksSuccess,
  updateTaskId,
  updateTasksSuccess,
} from '../../actions/tasks';
import { ITask } from '../../types/projectTasks';

const initialState: ITask[] | undefined = [];

export const tasks = createReducer({}, initialState);

tasks.on(fetchTasksSuccess, (_, payload) => {
  return payload.tasks;
});

tasks.on(updateTasksSuccess, (_, payload) => {
  return payload.tasks;
});

tasks.on(updateTaskId, (state, payload) => {
  const { taskId, _id } = payload;
  const updatedTasks = JSON.parse(JSON.stringify(state)).map((task: ITask) => {
    if (task.taskId === taskId) {
      task._id = _id;
    }

    return task;
  });

  return updatedTasks;
});

tasks.on(clearTasks, () => initialState);
