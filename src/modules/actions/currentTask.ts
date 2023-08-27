import { createAction, Dispatch } from 'redux-act';
import { Api } from '../../utils/API';
import { ITask } from '../types/tasks';
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

export const updateCurrentTask =
  (data: any, tid: string) => async (dispatch: Dispatch) => {
    try {
      if (data.files) {
        dispatch(startFilesLoading())
      }

      const res = await Api.Tasks.updateTask(data, tid);
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
