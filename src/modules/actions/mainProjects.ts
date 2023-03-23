import { createAction } from 'redux-act';
import { Project } from '../reducers/mainProjects';
import axios from 'axios';

export const editProjectSuccess = createAction<Project>('EDIT_PROJECT_SUCCESS');

export const editProjectFailure = createAction<string>('EDIT_PROJECT_FAILURE');

export const editProject = (token: string) => async (dispatch: any) => {
  const httpSource = axios.CancelToken.source();

  try {
    const response = await axios({
      method: 'POST',
      url: 'http://localhost:5000/projects',
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

export const updateProjects = createAction<Project[]>('UPDATE_PROJECTS');
