import { HTTPClient as HTTPClientCore, IRequestConfig } from '../HTTPSClient';
import axios, { AxiosRequestConfig } from 'axios';
import { ITask, ITasks } from '../../modules/types/tasks';
import { ITransaction } from '../../modules/types/transactions';
import { IComment, Project } from '../../modules/types/mainProjects';

class HTTPClient extends HTTPClientCore {
  private token: string | null;

  constructor(baseURL: string) {
    super({ baseURL });
    this.token = null;
  }

  public setToken(token: string | null): void {
    this.token = token;
  }

  public makeRequest<T = any>(config: IRequestConfig): Promise<T> {
    const source = axios.CancelToken.source();
    const storedDataString = localStorage.getItem('userData');
    const storedData = storedDataString ? JSON.parse(storedDataString) : {};

    const requestConfig: AxiosRequestConfig = {
      ...config,
      cancelToken: source.token,
      headers: {
        ...config.headers,
        Authorization: this.token
          ? `Bearer ${this.token}`
          : storedData.token
          ? `Bearer ${storedData.token}`
          : undefined,
        'Content-Type': 'application/json',
      },
    };

    const request: any = super.makeRequest(requestConfig);

    return request;
  }
}

const baseURL =
  process.env.REACT_APP_BACKEND_URL || 'https://pro-in.herokuapp.com';

export const APIClient = new HTTPClient(baseURL);

export const Api = {
  Projects: {
    create: () => APIClient.post(`/projects`),
    getAll: (userId: string) => APIClient.get(`/projects/all/${userId}`),
    get: (id: string) => APIClient.get(`/projects/user/${id}`),
    put: (projects: Project[], id: string) =>
      APIClient.put(`projects/user/${id}`, { projects }),
    patch: (props: Partial<Project>, pid: string) =>
      APIClient.patch(`projects/${pid}`, props),
    moveProject: ({
      projectId,
      toProjectId,
    }: {
      projectId: string;
      toProjectId: string;
    }) =>
      APIClient.post(`/projects/${projectId}/moving`, {
        projectId,
        toProjectId,
      }),
  },
  Subprojects: {
    create: (parentId: string) =>
      APIClient.post(`/projects/${parentId}/subprojects`),
  },
  Comments: {
    create: (props: Partial<IComment>, id: string) =>
      APIClient.post(`/projects/${id}/comment`, props),
    update: (props: Partial<IComment>, id: string) =>
      APIClient.patch(`projects/${id}/comment`, props),
    delete: (props: { id: string }, projectId: string) =>
      APIClient.delete(`/projects/${projectId}/comment`, props),
  },
  CurrentProject: {
    get: (id: string) => APIClient.get(`/projects/${id}`),
  },
  ProjectMembers: {
    get: (projectId: string) => APIClient.get(`/project-members/${projectId}`),
    delete: (props: { userId: string }, projectId: string) =>
      APIClient.delete(`/project-members/${projectId}/${props.userId}`),
    find: (userId: string, search: string) =>
      APIClient.get(`/users?id=${userId}&search=${search}`),
  },
  Files: {
    post: (props: Partial<Project>, pid: string) =>
      APIClient.post(`/projects/${pid}/files`, props),
    delete: (pid: string, fileId: string) =>
      APIClient.delete(`projects/${pid}/files/${fileId}`),
    deleteTasksFile: (tid: string, fileId: string) =>
      APIClient.delete(`/project-tasks/files/${tid}/${fileId}`),
    updateTaskFilesOrder: (props: Partial<ITask>, tid: string) =>
      APIClient.post(`/project-tasks/files/${tid}`, props),
    deleteTransactionsFile: (transactionId: string, fileId: string) =>
      APIClient.delete(`/transactions-list/files/${transactionId}/${fileId}`),
    updateTransactionFilesOrder: (
      props: Partial<ITransaction>,
      transactionId: string,
    ) => APIClient.post(`/transactions-list/files/${transactionId}`, props),
  },
  Tasks: {
    create: (props: Partial<ITask>, id: string) =>
      APIClient.post(`/project-tasks/${id}/create`, props),
    get: (pid: string) => APIClient.get(`/project-tasks/${pid}/tasks`),
    updateTasksByProjectId: (props: ITasks, pid: string) =>
      APIClient.post(`/project-tasks/${pid}`, props),
    updateTask: (props: Partial<ITask>, tid: string) =>
      APIClient.post(`/project-tasks/task/${tid}`, props),
    deleteTask: (tid: string) => APIClient.delete(`/project-tasks/${tid}`),
    getAllTasks: () => APIClient.get(`/project-tasks/all`),
    updateUserTasks: (props: { taskIds: string[] }) =>
      APIClient.post(`project-tasks/user`, props),
    createComment: (props: { comment: IComment }, id: string) =>
      APIClient.post(`project-tasks/${id}/comment`, props),
    deleteComment: (tid: string, commentId: string) =>
      APIClient.delete(`project-tasks/${tid}/comment/${commentId}`),
  },
  Transactions: {
    create: (props: Partial<ITransaction>) =>
      APIClient.post(`/transactions-list/transaction/`, props),
    update: (props: Partial<ITransaction>, transactionId: string) =>
      APIClient.patch(`transactions-list/transaction/${transactionId}`, props),
    delete: (id: string) =>
      APIClient.delete(`/transactions-list/transaction/${id}`),
    getTransactionById: (id: string) =>
      APIClient.get(`/transactions-list/transaction/${id}`),
    getProjectTransactions: (projectId: string) =>
      APIClient.get(`/transactions-list/project/${projectId}`),
    updateTransactionsByProjectId: (
      transactions: ITransaction[],
      projectId: string,
    ) =>
      APIClient.patch(`/transactions-list/project/${projectId}`, {
        transactions,
      }),
    getUserTransactions: () => APIClient.get(`/transactions-list/all`),
    updateTransactionsByUserId: (transactions: ITransaction[], id: string) =>
      APIClient.patch(`/transactions-list/user/${id}`, { transactions }),
  },
};
