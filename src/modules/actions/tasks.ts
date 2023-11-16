import { Dispatch } from 'redux';
import { createAction } from 'redux-act';
import { Api } from '../../utils/API';
import { ITask, ITaskRequest, ITaskUpdate, ITasks } from '../types/tasks';
import { v4 as uuidv4 } from 'uuid';
import { changeSnackbarState } from './snackbar';
import { RootState } from '../store/store';
import { IComment, IFile } from '../types/mainProjects';
import {
  findProjectByProjectId,
  updateEnitites,
  updateObjects,
} from '../../utils/utils';
import { updateCurrentTaskSuccess, updateTaskState } from './currentTask';
import { endLoading, startLoading } from './loading';
import ApiErrors from '../../utils/API/APIErrors';
import { updateUserTasksSuccess } from './userTasks';

export const fetchTasksSuccess = createAction<ITasks>('fetchTasksSuccess');
export const clearTasks = createAction('clearTasks');
export const updateTasksSuccess = createAction<ITasks>('updateTasksSuccess');
export const updateTaskId = createAction<{ taskId: string; _id: string }>(
  'updateTaskId',
);
export const fetchAllUserTasksSuccess = createAction<ITasks>(
  'fetchAllUserTasksSuccess',
);
export const deleteTaskCommentSuccess = createAction(
  'deleteTaskCommentSuccess',
);
export const deleteFileFromTaskSuccess = createAction(
  'deleteFileFromTaskSuccess',
);

export const updateTasksFunction = ({
  tasks,
  taskId,
  updatedTask,
}: {
  tasks: ITask[];
  taskId: string;
  updatedTask: ITask;
}) =>
  tasks.map((task: ITask) => {
    if (task._id === taskId) {
      task = updatedTask;
    }

    return task;
  });

export const taskStateUpdater = ({
  tasks,
  task,
  userTasks,
  dispatch,
}: {
  tasks: ITask[];
  task?: ITaskUpdate;
  userTasks: ITask[];
  dispatch: Dispatch;
}) => {
  if (!task) return;

  const updatedTasks = updateObjects(tasks, task);
  const updatedUserTasks = updateObjects(userTasks, task);

  dispatch(updateCurrentTaskSuccess({ task }));
  dispatch(updateTasksSuccess({ tasks: updatedTasks }));
  dispatch(updateUserTasksSuccess(updatedUserTasks));
};

export const fetchTasks = (projectId: string) => async (dispatch: Dispatch) => {
  try {
    const res = await Api.Tasks.get(projectId);

    dispatch(fetchTasksSuccess({ tasks: res.tasks }));
  } catch (e) {
    console.log(e);
  }
};

export const createTask =
  ({ projectId, name }: { projectId?: string; name: string }) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const { userId } = getState().user;
    const tasks = JSON.parse(JSON.stringify(getState().projectTasks));
    const userTasks = JSON.parse(JSON.stringify(getState().userTasks));
    const timestamp = new Date().toISOString();
    const id = uuidv4();

    try {
      const newTask = {
        timestamp,
        name,
        taskId: id,
        projectId,
        description: '',
        files: [],
        status: 'new',
        userId,
        _id: '',
      };

      if (projectId) {
        tasks.unshift(newTask);
        dispatch(updateTasksSuccess({ tasks }));
      } else {
        userTasks.unshift(newTask);
        dispatch(updateUserTasksSuccess(userTasks));
      }

      const res = await Api.Tasks.create(newTask);

      if (projectId) {
        dispatch(updateTaskId({ taskId: res.task.taskId, _id: res.task._id }));

        userTasks.unshift(res.task);

        dispatch(updateUserTasksSuccess(userTasks));
      } else {
        const updatedUserTasks = JSON.parse(JSON.stringify(userTasks)).map(
          (task: ITask) => {
            if (task.taskId === res.task.taskId) {
              task._id = res.task._id;
            }

            return task;
          },
        );

        dispatch(updateUserTasksSuccess(updatedUserTasks));
      }
    } catch (e) {
      console.log(e);
    }
  };

export const changeTasksOrder =
  (pid: string, newOrder: ITask[]) => async (dispatch: Dispatch) => {
    try {
      dispatch(updateTasksSuccess({ tasks: newOrder }));
      await Api.Tasks.updateTasksByProjectId({ tasks: newOrder }, pid);
    } catch (e: any) {
      console.log(e);
    }
  };

export const updateTaskById =
  (data: Partial<ITaskRequest>, taskId: string, projectId: string = '') =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const tasks = JSON.parse(JSON.stringify(getState().projectTasks));
    const userTasks = JSON.parse(JSON.stringify(getState().userTasks));

    try {
      const res = await Api.Tasks.updateTask({ ...data, projectId }, taskId);

      ApiErrors.checkOnApiError(res);

      const updatedTask: ITask = res.task;

      taskStateUpdater({
        tasks,
        task: updatedTask,
        userTasks,
        dispatch,
      });
    } catch (e: any) {
      changeSnackbarState({
        id: 'error',
        open: true,
        message: `${
          e.response.data
            ? e.response.data.message
            : 'Оновити задачу не вдалося'
        }. Перезавантажте сторінку`,
      });
    }
  };

export const updateTaskFilesOrder =
  ({ files, taskId }: { files: IFile[]; taskId: string }) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const tasks = getState().userTasks;
    try {
      const result = updateEnitites(tasks, taskId, files);

      if (!result) return;

      dispatch(updateTasksSuccess({ tasks: result.updatedEnities }));
      dispatch(updateCurrentTaskSuccess({ task: result.updatedEntity }));

      await Api.Files.updateTaskFilesOrder(
        { files: result.updatedEntity.files },
        taskId,
      );
    } catch (e: any) {
      changeSnackbarState({
        id: 'error',
        open: true,
        message: `${
          e.response.data
            ? e.response.data.message
            : 'Оновити задачу не вдалося'
        }. Перезавантажте сторінку`,
      });
    }
  };

export const deleteTask =
  (taskId: string) => async (dispatch: Dispatch, getState: () => RootState) => {
    const tasks = JSON.parse(JSON.stringify(getState().projectTasks));
    const userTasks = JSON.parse(JSON.stringify(getState().userTasks));
    const updatedTasks = tasks.filter((task: ITask) => task._id !== taskId);
    const updatedUserTasks = userTasks.filter(
      (task: ITask) => task._id !== taskId,
    );

    try {
      dispatch(updateTasksSuccess({ tasks: updatedTasks }));
      dispatch(updateUserTasksSuccess(updatedUserTasks));

      await Api.Tasks.deleteTask(taskId);
    } catch (e) {
      changeSnackbarState({
        id: 'error',
        open: true,
        message: `Виникла проблема.Перезавантажте сторінку`,
      });
    }
  };

export const fetchAllUserTasks = () => async (dispatch: Dispatch) => {
  try {
    dispatch(startLoading());
    const res = await Api.Tasks.getAllTasks();

    dispatch(fetchAllUserTasksSuccess({ tasks: res.tasks }));
    dispatch(endLoading());
  } catch (e) {
    dispatch(
      changeSnackbarState({
        id: 'error',
        open: true,
        message: `Виникла проблема.Перезавантажте сторінку`,
      }),
    );
  }
};

export const createTaskComment =
  (comment: IComment, taskId: string) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const currentTask = getState().currentTask;
    const tasks = JSON.parse(JSON.stringify(getState().projectTasks));
    const userTasks = JSON.parse(JSON.stringify(getState().userTasks));

    try {
      const updatedCurrentTask = {
        ...currentTask,
        comments: currentTask.comments
          ? [comment, ...currentTask.comments]
          : [comment],
      };

      taskStateUpdater({
        tasks,
        task: updatedCurrentTask,
        userTasks,
        dispatch,
      });

      const res = await Api.Tasks.createComment({ comment }, taskId);

      ApiErrors.checkOnApiError(res);

      dispatch(
        updateTaskState({
          task: {
            comments: res.task.comments,
            actions: res.task.actions,
          },
        }),
      );
    } catch (e) {
      console.log(e);
    }
  };

export const deleteTaskComment =
  (taskId: string, commentId: string) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const tasks: ITask[] = JSON.parse(JSON.stringify(getState().projectTasks));
    const userTasks: ITask[] = JSON.parse(JSON.stringify(getState().userTasks));

    try {
      const res = await Api.Tasks.deleteComment(taskId, commentId);

      ApiErrors.checkOnApiError(res);

      dispatch(deleteTaskCommentSuccess());

      const task: ITask = res.task;

      taskStateUpdater({ tasks, task, userTasks, dispatch });
    } catch (e) {
      console.log(e);
    }
  };

export const removeFileFromTask =
  (tid: string, fileId: string) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const tasks: ITask[] = JSON.parse(JSON.stringify(getState().projectTasks));
    const userTasks: ITask[] = JSON.parse(JSON.stringify(getState().userTasks));

    try {
      const res = await Api.Files.deleteTasksFile(tid, fileId);
      ApiErrors.checkOnApiError(res);

      dispatch(deleteFileFromTaskSuccess());

      const task = res.task;

      taskStateUpdater({ tasks, task, userTasks, dispatch });
    } catch (e) {
      console.log(e);
    }
  };

export const changeTaskProject =
  (id: string, projectId: string) =>
  async (dispatch: Dispatch, getState: () => RootState) => {
    const {
      projectTasks,
      userTasks,
      mainProjects: { allUserProjects },
    } = getState();

    const updatedUserTasks = userTasks.map((task) =>
      task._id === id ? { ...task, projectId } : task,
    );
    const filteredProjectTasks = projectTasks.filter((task) => task._id !== id);

    const oldProject = findProjectByProjectId(
      JSON.parse(JSON.stringify(allUserProjects)),
      userTasks.find((task) => task._id === id)?.projectId,
    );

    const newProject = findProjectByProjectId(
      JSON.parse(JSON.stringify(allUserProjects)),
      projectId,
    );

    if (oldProject) {
      oldProject.tasks = filteredProjectTasks
        ? filteredProjectTasks.map((task) => task._id)
        : [];
    }

    if (newProject) {
      newProject.tasks.unshift(id);
    }

    dispatch(updateUserTasksSuccess(updatedUserTasks));

    if (projectTasks) {
      dispatch(updateTasksSuccess({ tasks: filteredProjectTasks }));
    }

    if (newProject) {
      const res = await Api.Tasks.updateTaskProjectId(
        {
          oldProjectId: oldProject ? oldProject._id : '',
          newProjectId: newProject._id,
        },
        id,
      );

      ApiErrors.checkOnApiError(res);
    }
  };
