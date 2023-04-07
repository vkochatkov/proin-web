import { createAction } from 'redux-act';
import { Project } from '../reducers/mainProjects';
import { Dispatch } from 'redux';
import { clearFormInput } from './form';
import { RootState } from '../store';
import { IComment } from '../reducers/mainProjects';
import axios from 'axios';

export const setCurrentProject = createAction<Project>('SET_CURRENT_PROJECT');
export const updateProjects = createAction<Project[]>('UPDATE_PROJECTS');
export const editProjectFailure = createAction<string>('EDIT_PROJECT_FAILURE');
export const createProjectSuccess = createAction<Project>(
  'CREATE_PROJECT_SUCCESS'
);
export const addCommentToCurrentProject = createAction<{
  projectId: string;
  comment: IComment;
}>('ADD_COMMENT_TO_CURRENT_PROJECT');
export const clearCurrentProject = createAction('CLEAR_CURRENT_PROJECT');
export const clearProjects = createAction('CLEAR_PROJECTS');

const httpSource = axios.CancelToken.source();

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
    } catch (e) {
      console.log(e);
    }
  };
