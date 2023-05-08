import axios from 'axios';
import { createAction, Dispatch } from 'redux-act';
import { RootState } from '../store/store';
import { IMembers } from '../types/projectMembers';
import { changeSnackbarState } from './snackbar';

export const fetchMembersSuccess = createAction<IMembers>(
  'FETCH_MEMBERS_SUCCESS'
);
export const removeProjectMemberSuccess = createAction<IMembers>(
  'REMOVE_PROJECT_MEMBER_SUCCESS'
);

const httpSource = axios.CancelToken.source();

export const fetchMembers =
  (projectId: string) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const { token } = getState().user;

    try {
      const response = await axios({
        method: 'GET',
        url: `${process.env.REACT_APP_BACKEND_URL}/project-members/${projectId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: httpSource.token,
      });

      const projectMembers = response.data.projectMembers.map(
        (member: any) => ({
          role: member.role,
          status: member.status,
          userId: member.userId._id,
          name: member.userId.name,
          email: member.userId.email,
        })
      );

      dispatch(fetchMembersSuccess({ projectMembers }));
    } catch (e) {
      dispatch(
        changeSnackbarState({
          id: 'error',
          open: true,
          message: 'Щось пішло не так. Перезавантажте сторінку!',
        })
      );
    }
  };

export const removeProjectMember =
  (userId: string, projectId: string) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const { token } = getState().user;
    const members = getState().projectMembers.filter(
      (member) => member.userId !== userId
    );

    dispatch(removeProjectMemberSuccess({ members }));

    try {
      await axios({
        method: 'DELETE',
        url: `${process.env.REACT_APP_BACKEND_URL}/project-members/${projectId}`,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: JSON.stringify({ userId }),
        cancelToken: httpSource.token,
      });
    } catch (e: any) {
      dispatch(
        changeSnackbarState({
          id: 'error',
          open: true,
          message: `${e.response.data.message}. Перезавантажте сторінку!`,
        })
      );
    }
  };
