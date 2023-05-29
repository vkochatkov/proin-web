import { createAction, Dispatch } from 'redux-act';
import { Api } from '../../utils/API';
import { RootState } from '../store/store';
import { IAction, ITask } from '../types/currentProjectTasks';
import { changeSnackbarState } from './snackbar';

export const chooseCurrentTaskSuccess = createAction<{ task: ITask }>(
  'chooseCurrentTaskSuccess'
);
export const updateCurrentTaskSuccess = createAction<{ task: ITask }>(
  'updateCurrentTaskSuccess'
);
export const updateTaskState = createAction<{ task: ITask }>('updateTaskState');

export const updateCurrentTask =
  (data: Partial<ITask>, pid: string, tid: string) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const res = await Api.CurrentTask.updateTask(data, pid, tid);
      dispatch(updateCurrentTaskSuccess({ task: res.task }));
    } catch (e: any) {
      dispatch(
        changeSnackbarState({
          id: 'error',
          open: true,
          message: `Оновити задачу не вдалося. Перезавантажте сторінку!`,
        })
      );
    }
  };
