import { Dispatch } from 'redux';
import { createAction } from 'redux-act';
import { Api } from '../../utils/API';
import { ITask, ITasks } from '../types/currentProjectTasks';
import { v4 as uuidv4 } from 'uuid';
import { changeSnackbarState } from './snackbar';
import { RootState } from '../store/store';

export const fetchTasksSuccess = createAction<ITasks>('fetchTasksSuccess');
export const clearTasks = createAction('clearTasks');
export const updateTasksSuccess = createAction<ITasks>('updateTasksSuccess');
export const updateTaskId = createAction<{ taskId: string; _id: string }>(
  'updateTaskId'
);

export const fetchTasks = (projectId: string) => async (dispatch: Dispatch) => {
  try {
    const res = await Api.ProjectTasks.get(projectId);
    dispatch(fetchTasksSuccess({ tasks: res.tasks }));
  } catch (e: any) {
    changeSnackbarState({
      id: 'error',
      open: true,
      message: `${
        e.response.data
          ? e.response.data.message
          : 'Завантажити задачі не вдалося'
      }. Перезавантажте сторінку`,
    });
  }
};

export const createTask =
  ({ projectId, name }: { projectId: string; name: string }) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const { userId } = getState().user;
    const tasks = JSON.parse(JSON.stringify(getState().currentProjectTasks));
    const timestamp = new Date().toISOString();
    const id = uuidv4();

    try {
      const newTask = {
        timestamp,
        name,
        taskId: id,
        projectId,
        description: '',
        files: [],
        status: 'new',
        userId,
        _id: '',
      };

      tasks.unshift(newTask);
      dispatch(updateTasksSuccess({ tasks }));
      const res = await Api.ProjectTasks.create(newTask, projectId);
      dispatch(updateTaskId({ taskId: id, _id: res.task._id }));
    } catch (e: any) {
      changeSnackbarState({
        id: 'error',
        open: true,
        message: `${
          e.response.data
            ? e.response.data.message
            : 'Створити задачу не вдалося'
        }. Перезавантажте сторінку`,
      });
    }
  };

export const changeTasksOrder =
  (pid: string, newOrder: ITask[]) => async (dispatch: Dispatch) => {
    try {
      dispatch(updateTasksSuccess({ tasks: newOrder }));
      await Api.ProjectTasks.updateTasksByProjectId({ tasks: newOrder }, pid);
    } catch (e: any) {
      changeSnackbarState({
        id: 'error',
        open: true,
        message: `${
          e.response.data
            ? e.response.data.message
            : 'Зберегти послідовність задач не вдалося'
        }. Перезавантажте сторінку`,
      });
    }
  };
