import { createAction, Dispatch } from 'redux-act';
import { Api } from '../../utils/API';
import { ITask } from '../types/projectTasks';
import { changeSnackbarState } from './snackbar';

export const chooseCurrentTaskSuccess = createAction<{ task: ITask }>(
  'chooseCurrentTaskSuccess'
);
export const updateCurrentTaskSuccess = createAction<{ task: ITask }>(
  'updateCurrentTaskSuccess'
);
export const updateTaskState = createAction<{ task: ITask }>('updateTaskState');

export const updateCurrentTask =
  (data: any, pid: string, tid: string) => async (dispatch: Dispatch) => {
    try {
      const res = await Api.Tasks.updateCurrentTask(data, pid, tid);
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
