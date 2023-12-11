import { createAction } from 'redux-act';
import { Dispatch } from 'redux';
import { RootState } from '../store/store';
import axios from 'axios';
import { changeSnackbarState } from './snackbar';
import {
  IComment,
  IFile,
  IUserProject,
  ISubProjectAction,
  Project,
} from '../types/mainProjects';
import {
  endCommentFilesLoading,
  endLoading,
  startCommentFilesLoading,
  startLoading,
} from './loading';
import { fetchMembers } from './projectMembers';
import { IFoundUser } from '../types/users';
import { Api } from '../../utils/API';
import { fetchTasks } from './tasks';
import { updateEnitites } from '../../utils/utils';
import { updateUserTasksSuccess } from './userTasks';
import ApiErrors from '../../utils/API/APIErrors';

export const setCurrentProject = createAction<Project>('setCurrentProject');
export const updateProjectsSuccess = createAction<Project[]>(
  'updateProjectsSuccess',
);
export const updateUserProjectsSuccess = createAction<IUserProject[]>(
  'updateUserProjectsSuccess',
);
export const editProjectFailure = createAction<string>('editProjectFailure');
export const createProjectSuccess = createAction<Project>(
  'createProjectSuccess',
);
export const updateMainProjectsSuccess = createAction<{
  updatedCurrentProject: Project;
  updatedProjectsArray: Project[];
}>('updateMainProjectsSuccess');
export const clearCurrentProject = createAction('clearCurrentProject');
export const clearProjects = createAction('clearProjects');
export const setAllUserProjects =
  createAction<IUserProject[]>('setAllUserProjects');
export const selectItemId = createAction<string>('selectItemId');
export const updateProjectFiles = createAction<{
  projectId: string;
  files: IFile[];
}>('updateProjectFiles');
export const updateProjectFilesSuccess = createAction<Project>(
  'updateProjectFilesSuccess',
);
export const removeProjectFileSuccess = createAction(
  'removeProjectFileSuccess',
);
export const createCommentSuccess = createAction('createCommentSuccess');
export const clearMainProjects = createAction('clearMainProjects');
export const changeUserProjectsOrderSuccess = createAction<IUserProject[]>(
  'changeUserProjectsOrderSuccess',
);

const httpSource = axios.CancelToken.source();

export const createProjectComment =
  ({ comment }: { comment: IComment }) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const { currentProject, projects } = getState().mainProjects;

      if (!currentProject) return;

      let updatedCurrentProject: Project;
      let updatedProjectsArray: Project[];

      if (comment.files.length > 0) {
        dispatch(startCommentFilesLoading());

        const res = await Api.Comments.create(comment, currentProject._id);
        const comments = res.comments;

        updatedCurrentProject = {
          ...currentProject,
          comments,
        };

        updatedProjectsArray = projects.map((project) =>
          project.id === updatedCurrentProject._id
            ? updatedCurrentProject
            : project,
        );

        dispatch(
          updateMainProjectsSuccess({
            updatedCurrentProject,
            updatedProjectsArray,
          }),
        );

        dispatch(endCommentFilesLoading());

        return;
      }

      updatedCurrentProject = {
        ...currentProject,
        comments: currentProject.comments
          ? [comment, ...currentProject.comments]
          : [comment],
      };

      updatedProjectsArray = projects.map((project) =>
        project.id === updatedCurrentProject._id
          ? updatedCurrentProject
          : project,
      );

      dispatch(
        updateMainProjectsSuccess({
          updatedCurrentProject,
          updatedProjectsArray,
        }),
      );

      await Api.Comments.create(comment, currentProject._id);
      dispatch(createCommentSuccess());
    } catch (e) {
      console.log(e);
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
      const { currentProject, projects } = getState().mainProjects;

      if (!currentProject) {
        return;
      }

      if (!currentProject.comments) {
        return;
      }

      const updatedCurrentProject = {
        ...currentProject,
        comments: updatedComments,
      };

      const updatedProjectsArray = projects.map((project) =>
        project.id === updatedCurrentProject._id
          ? updatedCurrentProject
          : project,
      );

      dispatch(
        updateMainProjectsSuccess({
          updatedCurrentProject,
          updatedProjectsArray,
        }),
      );

      await Api.Comments.update({ ...updatedComment }, currentProject._id);
    } catch (e) {
      console.log(e);
    }
  };

export const deleteComment =
  (id: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const { currentProject } = getState().mainProjects;
      const { token } = getState().user;

      if (!currentProject) return;

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
      console.log(e);
    }
  };

export const createNewProject = () => async (dispatch: Dispatch) => {
  try {
    const response = await Api.Projects.create();

    ApiErrors.checkOnApiError(response);

    dispatch(createProjectSuccess(response.project));
    dispatch(updateUserTasksSuccess([]));

    dispatch(endLoading());
  } catch (e) {
    dispatch(editProjectFailure((e as any).message));
  }
};

export const openCurrentProject =
  (id: string, sendRequest: boolean = false) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    let currentProject;
    try {
      dispatch(fetchMembers(id) as any);
      dispatch(fetchTasks(id) as any);

      if (!sendRequest) {
        const { projects } = getState().mainProjects;
        currentProject = projects.filter((project) => project.id === id)[0];

        dispatch(setCurrentProject(currentProject));
        dispatch(endLoading());
      } else {
        dispatch(startLoading());

        const response = await Api.CurrentProject.get(id);

        dispatch(setCurrentProject(response.project));
        dispatch(endLoading());
      }
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
    } catch (e) {
      dispatch(editProjectFailure((e as Error).message));
    }
  };

export const updateOrderProjects =
  (projects: IUserProject[], newIndex: string) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    try {
      const { userId } = getState().user;
      const projectId = projects[+newIndex]._id;

      dispatch(changeUserProjectsOrderSuccess(projects));

      await Api.Projects.changeOrder(userId, { id: projectId, newIndex });
    } catch (e: any) {
      console.log(e);
    }
  };

export const updateProject =
  (props: Partial<Project>, projectId: string) =>
  async (dispatch: Dispatch) => {
    try {
      await Api.Projects.patch(props, projectId);
    } catch (e) {
      console.log(e);
    }
  };

export const updatedSubProjectsOrder =
  ({ projectId, newOrder, subProjectIndex }: ISubProjectAction) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const { projects } = getState().mainProjects;

    const projectIndex = projects.findIndex(
      (project) => project._id === projectId,
    );

    if (projectIndex === -1) return;

    const project = projects[projectIndex];
    const updatedProject = {
      ...project,
      subProjects: [...newOrder],
    };

    const updatedProjects = [
      ...projects.slice(0, projectIndex),
      updatedProject,
      ...projects.slice(projectIndex + 1),
    ];

    dispatch(
      updateMainProjectsSuccess({
        updatedCurrentProject: updatedProject,
        updatedProjectsArray: updatedProjects,
      }),
    );

    try {
      await Api.Projects.patch(
        { subProjects: updatedProject.subProjects },
        updatedProject._id,
      );
    } catch (e: any) {
      console.log(e);
    }
  };

export const sendInvitation =
  (users: IFoundUser[]) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const { currentProject } = getState().mainProjects;
    const { token } = getState().user;

    try {
      if (!currentProject) {
        return;
      }

      await axios({
        method: 'POST',
        url: `${process.env.REACT_APP_BACKEND_URL}/projects/${currentProject.id}/invite`,
        data: JSON.stringify({ users }),
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
        }),
      );
    } catch (e) {
      console.log(e);
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
        }),
      );
    } catch (e) {
      console.log(e);
    }
  };

export const fetchProjects =
  () => async (dispatch: Dispatch, getState: () => RootState) => {
    const { userId } = getState().user;

    try {
      const res = await Api.Projects.get(userId);
      dispatch(updateProjectsSuccess(res.projects));
    } catch (e: any) {
      console.log(e);
    }
  };

export const fetchAllUserProjects =
  () => async (dispatch: Dispatch, getState: () => RootState) => {
    const { userId } = getState().user;

    const response = await Api.Projects.get(userId);

    dispatch(setAllUserProjects(response.projects));
    try {
    } catch (e: any) {
      console.log(e);
    }
  };

export const fetchLimitedUserProjects =
  (page: number, limit: number) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const { userId } = getState().user;
    const projects = getState().mainProjects.allUserProjects;

    const response = await Api.Projects.fetch(page, limit, userId);
    const updatedProjects = [...projects, ...response.projects];

    dispatch(setAllUserProjects(updatedProjects));

    return response.projects;
  };

export const moveToProject =
  (
    toProjectId: string,
    currentProjectId: string,
    isHomePage: boolean = false,
  ) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const { currentProject, projects } = getState().mainProjects;

    try {
      if (isHomePage) {
        const updatedProjects = JSON.parse(JSON.stringify(projects));

        const projectToMoveIndex = updatedProjects.findIndex(
          (project: Project) => project.id === currentProjectId,
        );

        const targetProjectIndex = updatedProjects.findIndex(
          (project: Project) => project.id === toProjectId,
        );

        const targetProject = updatedProjects[targetProjectIndex];

        const projectToMove = updatedProjects.splice(projectToMoveIndex, 1)[0];
        projectToMove.parentProject = targetProject._id;

        targetProject.subProjects.push(projectToMove);

        dispatch(updateProjectsSuccess(updatedProjects));
      } else {
        if (!currentProject) return;

        const projectToMove: Project = JSON.parse(
          JSON.stringify(currentProject),
        ).subProjects.find((p: Project) => p.id === currentProjectId);
        const subProjects = [...currentProject.subProjects].filter(
          (sp: Project) => sp.id !== currentProjectId,
        );

        const updatedCurrentProject = {
          ...currentProject,
          subProjects,
        };

        if (projectToMove.parentProject) {
          delete projectToMove.parentProject;
        }

        const updatedProjects = [
          ...JSON.parse(JSON.stringify(projects)),
          projectToMove,
        ];

        dispatch(setCurrentProject(updatedCurrentProject));
        dispatch(updateProjectsSuccess(updatedProjects));
      }

      await Api.Projects.moveProject({
        projectId: currentProjectId,
        toProjectId,
      });
    } catch (e) {
      console.log(e);
    }
  };

export const removeFile =
  (fileId: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    const currentProject = JSON.parse(
      JSON.stringify(getState().mainProjects.currentProject),
    );

    try {
      if (!currentProject) return;

      currentProject.files = currentProject.files.filter(
        (file: IFile) => file.id !== fileId,
      );

      dispatch(setCurrentProject(currentProject));

      await Api.Files.delete(currentProject._id, fileId);

      dispatch(removeProjectFileSuccess());
    } catch (e) {
      console.log(e);
    }
  };

export const createNewSubproject =
  (parentId: string) => async (dispatch: Dispatch) => {
    try {
      const response = await Api.Subprojects.create(parentId);
      dispatch(setCurrentProject(response.subproject));

      return response.subproject;
    } catch (e) {
      console.log(e);
    }
  };

export const updateFilesOrder =
  (projectId: string, files: IFile[]) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const projects: Project[] = JSON.parse(
      JSON.stringify(getState().mainProjects.projects),
    );

    const result = updateEnitites(projects, projectId, files);

    if (!result) return;

    dispatch(
      updateMainProjectsSuccess({
        updatedCurrentProject: result.updatedEntity,
        updatedProjectsArray: result.updatedEnities,
      }),
    );

    try {
      await Api.Files.post({ files }, result.updatedEntity._id);
    } catch (e) {
      console.log(e);
    }
  };

export const updateSubprojectFilesOrder =
  (projectId: string, subprojectId: string, files: IFile[]) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const projects: Project[] = JSON.parse(
      JSON.stringify(getState().mainProjects.projects),
    );

    const projectIndex = projects.findIndex(
      (project) => project._id === projectId,
    );

    if (projectIndex === -1) {
      return;
    }

    const subprojectIndex = projects[projectIndex].subProjects.findIndex(
      (subproject: Project) => subproject._id === subprojectId,
    );

    if (subprojectIndex === -1) {
      return;
    }

    const updatedSubproject = {
      ...projects[projectIndex].subProjects[subprojectIndex],
      files,
    };

    const updatedSubprojects = [
      ...projects[projectIndex].subProjects.slice(0, subprojectIndex),
      updatedSubproject,
      ...projects[projectIndex].subProjects.slice(subprojectIndex + 1),
    ];

    const updatedProject = {
      ...projects[projectIndex],
      subProjects: updatedSubprojects,
    };

    const updatedProjects = [
      ...projects.slice(0, projectIndex),
      updatedProject,
      ...projects.slice(projectIndex + 1),
    ];

    dispatch(
      updateMainProjectsSuccess({
        updatedCurrentProject: updatedSubproject,
        updatedProjectsArray: updatedProjects,
      }),
    );

    try {
      await Api.Files.post({ files }, updatedSubproject._id);
    } catch (e) {
      console.log(e);
    }
  };
