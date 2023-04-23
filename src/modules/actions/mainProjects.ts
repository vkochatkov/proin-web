import { createAction } from 'redux-act';
import { Project } from '../reducers/mainProjects';
import { Dispatch } from 'redux';
import { clearFormInput } from './form';
import { RootState } from '../store';
import { IComment } from '../reducers/mainProjects';
import axios from 'axios';
import { changeSnackbarState } from './snackbar';

export const setCurrentProject = createAction<Project>('SET_CURRENT_PROJECT');
export const updateProjects = createAction<Project[]>('UPDATE_PROJECTS');
export const editProjectFailure = createAction<string>('EDIT_PROJECT_FAILURE');
export const createProjectSuccess = createAction<Project>(
  'CREATE_PROJECT_SUCCESS'
);
export const updateProjectCommentsSuccess = createAction<{
  updatedCurrentProject: Project;
  updatedProjectsArray: Project[];
}>('UPDATE_PROJECT_COMMENTS_SUCCESS');
export const clearCurrentProject = createAction('CLEAR_CURRENT_PROJECT');
export const clearProjects = createAction('CLEAR_PROJECTS');

const httpSource = axios.CancelToken.source();

export const createProjectComments =
  ({ comment }: { comment: IComment }) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const { token } = getState().user;
      const { currentProject, projects } = getState().mainProjects;

      if (!currentProject)
        return dispatch(
          changeSnackbarState({
            id: 'error',
            open: true,
            message: 'Проекту немає, сталася помилка',
          })
        );

      const updatedCurrentProject = {
        ...currentProject,
        comments: currentProject.comments
          ? [comment, ...currentProject.comments]
          : [comment],
      };

      const updatedProjectsArray = projects.map((project) =>
        project.id === updatedCurrentProject._id
          ? updatedCurrentProject
          : project
      );

      dispatch(
        updateProjectCommentsSuccess({
          updatedCurrentProject,
          updatedProjectsArray,
        })
      );

      await axios({
        method: 'POST',
        url: `${process.env.REACT_APP_BACKEND_URL}/projects/${currentProject._id}/comment`,
        data: JSON.stringify(comment),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cancelToken: httpSource.token,
      });
    } catch (e) {
      dispatch(
        changeSnackbarState({
          id: 'error',
          open: true,
          message:
            'Щось пішло не так. Коментар не створено. Перезавантажте сторінку!',
        })
      );
    }
  };

export const updateComment =
  ({
    updatedComments,
    updatedComment,
  }: {
    updatedComments: IComment[];
    updatedComment: IComment;
  }) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const { token } = getState().user;
      const { currentProject, projects } = getState().mainProjects;

      if (!currentProject) {
        return dispatch(
          changeSnackbarState({
            id: 'error',
            open: true,
            message: 'Проекту немає, сталася помилка',
          })
        );
      }

      if (!currentProject.comments) {
        return dispatch(
          changeSnackbarState({
            id: 'error',
            open: true,
            message: 'Коментарів немає, сталася помилка',
          })
        );
      }

      const updatedCurrentProject = {
        ...currentProject,
        comments: updatedComments,
      };

      const updatedProjectsArray = projects.map((project) =>
        project.id === updatedCurrentProject._id
          ? updatedCurrentProject
          : project
      );

      dispatch(
        updateProjectCommentsSuccess({
          updatedCurrentProject,
          updatedProjectsArray,
        })
      );

      await axios({
        method: 'PATCH',
        url: `${process.env.REACT_APP_BACKEND_URL}/projects/${currentProject._id}/comment`,
        data: JSON.stringify(updatedComment),
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cancelToken: httpSource.token,
      });
    } catch (e) {
      dispatch(
        changeSnackbarState({
          id: 'error',
          open: true,
          message:
            'Щось пішло не так. Коментар не оновлено. Перезавантажте сторінку!',
        })
      );
    }
  };

export const deleteComment =
  (id: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const { currentProject } = getState().mainProjects;
      const { token } = getState().user;

      if (!currentProject)
        return dispatch(
          changeSnackbarState({
            id: 'error',
            open: true,
            message: 'Проекту немає, сталася помилка',
          })
        );

      await axios({
        method: 'DELETE',
        url: `${process.env.REACT_APP_BACKEND_URL}/projects/${currentProject._id}/comment`,
        data: { id },
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cancelToken: httpSource.token,
      });
    } catch (e) {
      dispatch(
        changeSnackbarState({
          id: 'error',
          open: true,
          message:
            'Щось пішло не так. Коментар не видалено. Перезавантажте сторінку!',
        })
      );
    }
  };

export const createNewProject =
  (token: string) => async (dispatch: Dispatch) => {
    try {
      const response = await axios({
        method: 'POST',
        url: `${process.env.REACT_APP_BACKEND_URL}/projects`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: httpSource.token,
      });

      dispatch(createProjectSuccess(response.data.project));
    } catch (e) {
      dispatch(editProjectFailure((e as any).message));
    }
  };

export const openCurrentProject =
  (token: string, id: string) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const { projects } = getState().mainProjects;
      const currentProject = projects.filter((project) => project.id === id);

      dispatch(setCurrentProject(currentProject[0]));
    } catch (e) {
      dispatch(editProjectFailure((e as Error).message));
    }
  };

export const deleteCurrentProject =
  (token: string, id: string) => async (dispatch: Dispatch) => {
    try {
      await axios({
        method: 'DELETE',
        url: `${process.env.REACT_APP_BACKEND_URL}/projects/${id}`,
        headers: {
          Authorization: 'Bearer ' + token,
        },
        cancelToken: httpSource.token,
      });

      dispatch(clearCurrentProject());
      dispatch(clearFormInput());
    } catch (e) {
      dispatch(editProjectFailure((e as Error).message));
    }
  };

export const updateOrderProjects =
  (projects: Project[]) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const { userId, token } = getState().user;

      dispatch(updateProjects(projects));

      await axios({
        method: 'PUT',
        url: `${process.env.REACT_APP_BACKEND_URL}/projects/user/${userId}`,
        data: { projects },
        headers: {
          Authorization: 'Bearer ' + token,
        },
        cancelToken: httpSource.token,
      });
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

export const sendInvitation =
  (email: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    const { currentProject } = getState().mainProjects;
    const { token } = getState().user;

    try {
      if (!currentProject) {
        return dispatch(
          dispatch(
            changeSnackbarState({
              id: 'error',
              open: true,
              message: `Проект не знайдено. Перезавантажте сторінку`,
            })
          )
        );
      }

      await axios({
        method: 'POST',
        url: `${process.env.REACT_APP_BACKEND_URL}/projects/${currentProject.id}/invite`,
        data: JSON.stringify({ email }),
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        cancelToken: httpSource.token,
      });

      dispatch(
        changeSnackbarState({
          id: 'success',
          open: true,
          message: `Запрошення успішно відправлене. Перевірте пошту"`,
        })
      );
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

export const acceptInvitation =
  ({ id, invitationId }: { id: string; invitationId: string }) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const { token } = getState().user;

    try {
      await axios({
        method: 'POST',
        url: `${process.env.REACT_APP_BACKEND_URL}/projects/${id}/invitations/${invitationId}`,
        headers: {
          Authorization: 'Bearer ' + token,
        },
        cancelToken: httpSource.token,
      });

      window.location.reload();
      dispatch(
        changeSnackbarState({
          id: 'success',
          open: true,
          message: 'Учасник успішно доданий до проекту',
        })
      );
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
