import { createAction } from 'redux-act';
import { Project } from '../reducers/mainProjects';
import { Dispatch } from 'redux';
import axios from 'axios';

export const editProjectSuccess = createAction<Project>('EDIT_PROJECT_SUCCESS');
export const updateProjects = createAction<Project[]>('UPDATE_PROJECTS');
export const editProjectFailure = createAction<string>('EDIT_PROJECT_FAILURE');
export const clearCurrentProject = createAction('CLEAR_CURRENT_PROJECT');

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

      dispatch(editProjectSuccess(response.data.project));
    } catch (e) {
      dispatch(editProjectFailure((e as any).message));
    }
  };

export const editCurrentProject =
  (token: string, id: string) => async (dispatch: Dispatch) => {
    try {
      const res = await axios({
        method: 'GET',
        url: `${process.env.REACT_APP_BACKEND_URL}/projects/${id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cancelToken: httpSource.token,
      });

      dispatch(editProjectSuccess(res.data.project));
    } catch (e) {
      dispatch(editProjectFailure((e as any).message));
    }
  };
