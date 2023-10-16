import { createAction, Dispatch } from 'redux-act';
import { Api } from '../../utils/API';
import ApiErrors from '../../utils/API/APIErrors';
import { ITask } from '../types/tasks';
import { endFilesLoading, startFilesLoading } from './loading';
import { changeSnackbarState } from './snackbar';
import { taskStateUpdater } from './tasks';
import { RootState } from '../store/store';

export const chooseCurrentTaskSuccess = createAction<{ task: ITask }>(
  'chooseCurrentTaskSuccess',
);
export const updateCurrentTaskSuccess = createAction<{ task: ITask }>(
  'updateCurrentTaskSuccess',
);

export const updateTaskState = createAction<{ task: Partial<ITask> }>(
  'updateTaskState',
);
export const updateCurrentTaskDiarySuccess = createAction<{
  task: Partial<ITask>;
}>('updateCurrentTaskDiarySuccess');

export const updateCurrentTask =
  (data: any, tid: string) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const tasks = JSON.parse(JSON.stringify(getState().projectTasks));
    const userTasks = JSON.parse(JSON.stringify(getState().userTasks));
    const currentTask = JSON.parse(JSON.stringify(getState().currentTask));
    const updatedTask = {
      ...currentTask,
      ...data,
    };
    try {
      if (data.files) {
        dispatch(startFilesLoading());
      }

      if (!data.files) {
        taskStateUpdater({
          tasks,
          task: updatedTask,
          userTasks,
          //@ts-ignore
          dispatch,
        });
      }

      const res = await Api.Tasks.updateTask(data, tid);

      if (data.files) {
        taskStateUpdater({
          tasks,
          task: res.task,
          userTasks,
          //@ts-ignore
          dispatch,
        });
      }

      ApiErrors.checkOnApiError(res);
      dispatch(endFilesLoading());
    } catch (e: any) {
      dispatch(
        changeSnackbarState({
          id: 'error',
          open: true,
          message: `Оновити задачу не вдалося. Перезавантажте сторінку!`,
        }),
      );
    }
  };

export const updateCurrentTaskDiary =
  (data: any, tid: string) => async (dispatch: Dispatch) => {
    try {
      const res = await Api.Tasks.updateTask(data, tid);

      ApiErrors.checkOnApiError(res);
      dispatch(updateCurrentTaskDiarySuccess({ task: res.task }));
    } catch (e: any) {
      dispatch(
        changeSnackbarState({
          id: 'error',
          open: true,
          message: `Оновити задачу не вдалося. Перезавантажте сторінку!`,
        }),
      );
    }
  };
