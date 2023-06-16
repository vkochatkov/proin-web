import { Dispatch } from 'redux';
import { createAction } from 'redux-act';
import { Api } from '../../utils/API';
import { ITask, ITasks } from '../types/projectTasks';
import { v4 as uuidv4 } from 'uuid';
import { changeSnackbarState } from './snackbar';
import { RootState } from '../store/store';
import { IFile } from '../types/mainProjects';
import { updateEnitites } from '../../utils/utils';
import { updateCurrentTaskSuccess } from './currentTask';
import { endLoading, startLoading } from './loading';
import ApiErrors from '../../utils/API/APIErrors';
import { updateUserTasksSuccess } from './userTasks';

export const fetchTasksSuccess = createAction<ITasks>('fetchTasksSuccess');
export const clearTasks = createAction('clearTasks');
export const updateTasksSuccess = createAction<ITasks>('updateTasksSuccess');
export const updateTaskId = createAction<{ taskId: string; _id: string }>(
  'updateTaskId'
);
export const fetchAllUserTasksSuccess = createAction<ITasks>(
  'fetchAllUserTasksSuccess'
);

export const updateTasksFunction = ({
  tasks,
  taskId,
  updatedTask,
}: {
  tasks: ITask[];
  taskId: string;
  updatedTask: ITask;
}) =>
  tasks.map((task: ITask) => {
    if (task._id === taskId) {
      task = updatedTask;
    }

    return task;
  });

export const fetchTasks = (projectId: string) => async (dispatch: Dispatch) => {
  try {
    const res = await Api.Tasks.get(projectId);
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
    const tasks = JSON.parse(JSON.stringify(getState().projectTasks));
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
      const res = await Api.Tasks.create(newTask, projectId);

      dispatch(updateTaskId({ taskId: res.task.taskId, _id: res.task._id }));
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
      await Api.Tasks.updateTasksByProjectId({ tasks: newOrder }, pid);
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

export const updateTaskById =
  (data: Partial<ITask>, taskId: string, pid?: string) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const tasks = JSON.parse(JSON.stringify(getState().projectTasks));
    const userTasks = JSON.parse(JSON.stringify(getState().userTasks));
    try {
      const res = await Api.Tasks.updateTask(
        { ...data, projectId: pid ? pid : '' },
        taskId
      );

      ApiErrors.checkOnApiError(res);

      const updatedTask: ITask = res.task;
      const updatedTasks = updateTasksFunction({
        tasks,
        taskId,
        updatedTask,
      });
      const updatedUserTasks = updateTasksFunction({
        tasks: userTasks,
        taskId,
        updatedTask,
      });

      dispatch(updateTasksSuccess({ tasks: updatedTasks }));
      dispatch(updateUserTasksSuccess(updatedUserTasks));
    } catch (e: any) {
      changeSnackbarState({
        id: 'error',
        open: true,
        message: `${
          e.response.data
            ? e.response.data.message
            : 'Оновити задачу не вдалося'
        }. Перезавантажте сторінку`,
      });
    }
  };

export const updateTaskFilesOrder =
  ({ files, taskId }: { files: IFile[]; taskId: string }) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const tasks = getState().projectTasks;
    try {
      const result = updateEnitites(tasks, taskId, files);

      if (!result) return;

      dispatch(updateTasksSuccess({ tasks: result.updatedEnities }));
      dispatch(updateCurrentTaskSuccess({ task: result.updatedEntity }));

      await Api.Tasks.updateTaskFilesOrder(
        { files: result.updatedEntity.files },
        taskId
      );
    } catch (e: any) {
      changeSnackbarState({
        id: 'error',
        open: true,
        message: `${
          e.response.data
            ? e.response.data.message
            : 'Оновити задачу не вдалося'
        }. Перезавантажте сторінку`,
      });
    }
  };

export const deleteTask =
  (taskId: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    const tasks = JSON.parse(JSON.stringify(getState().projectTasks));
    const userTasks = JSON.parse(JSON.stringify(getState().userTasks));
    const updatedTasks = tasks.filter((task: ITask) => task._id !== taskId);
    const updatedUserTasks = userTasks.filter(
      (task: ITask) => task._id !== taskId
    );

    try {
      dispatch(updateTasksSuccess({ tasks: updatedTasks }));
      dispatch(updateUserTasksSuccess(updatedUserTasks));

      await Api.Tasks.deleteTask(taskId);
    } catch (e) {
      changeSnackbarState({
        id: 'error',
        open: true,
        message: `Виникла проблема.Перезавантажте сторінку`,
      });
    }
  };

export const fetchAllUserTasks = () => async (dispatch: Dispatch) => {
  try {
    dispatch(startLoading());
    const res = await Api.Tasks.getAllTasks();

    dispatch(fetchAllUserTasksSuccess({ tasks: res.tasks }));
    dispatch(endLoading());
  } catch (e) {
    dispatch(
      changeSnackbarState({
        id: 'error',
        open: true,
        message: `Виникла проблема.Перезавантажте сторінку`,
      })
    );
  }
};
