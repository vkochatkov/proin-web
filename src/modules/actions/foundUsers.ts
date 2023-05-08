import axios from 'axios';
import { createAction, Dispatch } from 'redux-act';
import { RootState } from '../store/store';
import { IFoundUser, IFoundUsers } from '../types/users';
import { changeSnackbarState } from './snackbar';

const httpSource = axios.CancelToken.source();

export const foundUsersSuccess = createAction<IFoundUsers>(
  'FOUND_USERS_SUCCESS'
);

export const searchUsers =
  (search: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    const { userId } = getState().user;

    try {
      const response = await axios({
        method: 'GET',
        url: `${process.env.REACT_APP_BACKEND_URL}/users?id=${userId}&search=${search}`,
        headers: {
          'Content-Type': 'application/json',
        },
        cancelToken: httpSource.token,
      });

      const foundUsers = response.data.users.map((user: IFoundUser) => ({
        name: user.name,
        email: user.email,
        id: user.id,
      }));

      dispatch(foundUsersSuccess({ foundUsers }));
    } catch (e: any) {
      dispatch(
        changeSnackbarState({
          id: 'error',
          open: true,
          message: `${e.response.data.message}. Перезавантажте сторінку`,
        })
      );
    }
  };
