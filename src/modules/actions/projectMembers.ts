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
      const members = getState().projectMembers.filter(
        (member) => member.userId !== userId
      );

      dispatch(removeProjectMemberSuccess({ members }));

      try {
        await Api.ProjectMembers.delete({ userId }, projectId);
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
