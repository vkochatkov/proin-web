import axios from 'axios';
import { createAction, Dispatch } from 'redux-act';
import { RootState } from '../store/store';
import { IMembers } from '../types/projectMembers';
import { changeSnackbarState } from './snackbar';
import { Api } from '../../utils/API';

export const fetchMembersSuccess = createAction<IMembers>(
  'fetchMembersSuccess'
);
export const removeProjectMemberSuccess = createAction<IMembers>(
  'removeProjectMemberSuccess'
);

const httpSource = axios.CancelToken.source();

export const fetchMembers =
  (projectId: string) => async (dispatch: Dispatch) => {
    try {
      const response = await Api.ProjectMembers.get(projectId);

      const projectMembers = response.projectMembers.map((member: any) => ({
        role: member.role,
        status: member.status,
        userId: member.userId._id,
        name: member.userId.name,
        email: member.userId.email,
      }));

      dispatch(fetchMembersSuccess({ projectMembers }));
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
