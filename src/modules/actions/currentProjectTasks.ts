import { Dispatch } from 'redux';
import { createAction } from 'redux-act';
import { Api } from '../../utils/API';
import { ITasks } from '../types/currentProjectTasks';
import { v4 as uuidv4 } from 'uuid';

export const fetchTasksSuccess = createAction<ITasks>('fetchTasksSuccess');
export const clearTasks = createAction('clearTasks');

export const fetchTasks = (projectId: string) => async (dispatch: Dispatch) => {
  try {
    const res = await Api.ProjectTasks.get(projectId);
    dispatch(fetchTasksSuccess({ tasks: res.tasks }));
  } catch (e: any) {}
};

export const createTask =
  ({ projectId, name }: { projectId: string; name: string }) =>
  async () => {
    const timestamp = new Date().toISOString();
    const id = uuidv4();

    try {
      const res = await Api.ProjectTasks.create(
        { timestamp, name, taskId: id },
        projectId
      );
      console.log(res.task);
    } catch (e) {}
  };
