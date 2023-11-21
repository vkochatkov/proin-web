import { createAction, Dispatch } from 'redux-act';
import { Api } from '../../utils/API';
import ApiErrors from '../../utils/API/APIErrors';
import { ITask } from '../types/tasks';

export const updateUserTasksSuccess = createAction<ITask[]>(
  'updateUserTasksSuccess',
);
export const clearUserTasks = createAction('clearUserTasks');

export const changeUserTasksOrder =
  (tasks: ITask[]) => async (dispatch: Dispatch) => {
    try {
      const taskIds = tasks.map((task) => task._id);

      dispatch(updateUserTasksSuccess(tasks));
      const res = await Api.Tasks.updateUserTasks({ taskIds });

      ApiErrors.checkOnApiError(res);
    } catch (e) {
      console.log(e);
    }
  };
