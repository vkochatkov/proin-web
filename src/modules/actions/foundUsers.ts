import { createAction, Dispatch } from 'redux-act';
import { Api } from '../../utils/API';
import { RootState } from '../store/store';
import { IFoundUser, IFoundUsers } from '../types/users';

export const foundUsersSuccess = createAction<IFoundUsers>('foundUsersSuccess');

export const searchUsers =
  (search: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    const { userId } = getState().user;

    try {
      const response = await Api.ProjectMembers.find(userId, search);

      const foundUsers = response.users.map((user: IFoundUser) => ({
        name: user.name,
        email: user.email,
        id: user.id,
      }));

      dispatch(foundUsersSuccess({ foundUsers }));
    } catch (e) {
      console.log(e);
    }
  };
