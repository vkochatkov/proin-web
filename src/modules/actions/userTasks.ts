import { createAction, Dispatch } from 'redux-act';
import { Api } from '../../utils/API';
import ApiErrors from '../../utils/API/APIErrors';
import { ITask } from '../types/projectTasks';
import { changeSnackbarState } from './snackbar';

export const updateUserTasksSuccess = createAction<ITask[]>(
  'updateUserTasksSuccess'
);

export const changeUserTasksOrder =
  (tasks: ITask[]) => async (dispatch: Dispatch) => {
    try {
      const taskIds = tasks.map((task) => task._id);

      dispatch(updateUserTasksSuccess(tasks));
      const res = await Api.Tasks.updateUserTasks({ taskIds });

      ApiErrors.checkOnApiError(res);
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
