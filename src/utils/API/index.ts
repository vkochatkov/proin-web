import { HTTPClient as HTTPClientCore, IRequestConfig } from '../HTTPSClient';
import axios, { AxiosRequestConfig } from 'axios';
import { IComment, Project } from '../../modules/reducers/mainProjects';
import { ITask, ITasks } from '../../modules/types/currentProjectTasks';

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

    const requestConfig: AxiosRequestConfig = {
      ...config,
      cancelToken: source.token,
      headers: {
        ...config.headers,
        Authorization: this.token ? `Bearer ${this.token}` : undefined,
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
  },
  CurrentProject: {
    get: (id: string) => APIClient.get(`/projects/${id}`),
  },
  ProjectMembers: {
    get: (projectId: string) => APIClient.get(`/project-members/${projectId}`),
    delete: (userId: string, projectId: string) =>
      APIClient.delete(`/project-members/${projectId}`, { userId }),
  },
  Files: {
    post: (props: Partial<Project>, pid: string) =>
      APIClient.post(`/projects/${pid}/files`, props),
    delete: (pid: string, fileId: string) =>
      APIClient.delete(`projects/${pid}/files/${fileId}`),
  },
  Tasks: {
    create: (props: Partial<ITask>, id: string) =>
      APIClient.post(`/project-tasks/${id}/create`, props),
    get: (pid: string) => APIClient.get(`/project-tasks/${pid}/tasks`),
    updateTasksByProjectId: (props: ITasks, pid: string) =>
      APIClient.post(`/project-tasks/${pid}`, props),
  },
  CurrentTask: {
    updateTask: (props: Partial<ITask>, pid: string, tid: string) =>
      APIClient.post(`/project-tasks/${pid}/tasks/${tid}`, props),
  },
};
