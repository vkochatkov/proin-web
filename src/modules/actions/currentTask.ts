import { createAction, Dispatch } from 'redux-act';
import { Api } from '../../utils/API';
import ApiErrors from '../../utils/API/APIErrors';
import { IAction, ITask } from '../types/tasks';
import { endFilesLoading, startFilesLoading } from './loading';
import { changeSnackbarState } from './snackbar';

export const chooseCurrentTaskSuccess = createAction<{ task: ITask }>(
  'chooseCurrentTaskSuccess'
);
export const updateCurrentTaskSuccess = createAction<{ task: ITask }>(
  'updateCurrentTaskSuccess'
);

export const updateTaskState = createAction<{ task: Partial<ITask> }>(
  'updateTaskState'
);
export const updateCurrentTaskDiarySuccess = createAction<{ task: Partial<ITask> }>(
  'updateCurrentTaskDiarySuccess'
);

export const updateCurrentTask =
  (data: any, tid: string) => async (dispatch: Dispatch) => {
    try {
      if (data.files) {
        dispatch(startFilesLoading())
      }

      const res = await Api.Tasks.updateTask(data, tid);

      ApiErrors.checkOnApiError(res);
      dispatch(endFilesLoading());
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
        })
      );
    }
  };  