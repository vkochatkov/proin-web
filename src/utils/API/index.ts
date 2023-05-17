import { HTTPClient as HTTPClientCore, IRequestConfig } from '../HTTPSClient';
import axios, { AxiosRequestConfig } from 'axios';
import { Project } from '../../modules/reducers/mainProjects';

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
  Subprojects: {
    create: (parentId: string) =>
      APIClient.post(`/projects/${parentId}/subprojects`),
  },
  CurrentProject: {
    get: (id: string) => APIClient.get(`/projects/${id}`),
  },
  ProjectMembers: {
    get: (projectId: string) => APIClient.get(`/project-members/${projectId}`),
  },
  Projects: {
    getAll: (userId: string) => APIClient.get(`/projects/all/${userId}`),
    get: (id: string) => APIClient.get(`/projects/user/${id}`),
    put: (projects: Project[], id: string) =>
      APIClient.put(`projects/user/${id}`, { projects }),
    patch: (props: Partial<Project>, pid: string) =>
      APIClient.patch(`projects/${pid}`, props),
  },
  Files: {
    post: (props: Partial<Project>, pid: string) =>
      APIClient.post(`/projects/${pid}/files`, props),
  },
};
