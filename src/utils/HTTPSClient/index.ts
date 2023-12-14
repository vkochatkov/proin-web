import axios, {
  AxiosError,
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosResponseTransformer,
} from 'axios';

import { bindAll, isFunction, merge } from 'lodash';

type RequestConfigOrNone = AxiosRequestConfig | undefined | null | false | void;

export type IRequestConfig = AxiosRequestConfig;

interface IHTTPClientConfig extends AxiosRequestConfig {
  readonly baseURL: string;
  readonly withCredentials?: boolean;
  readonly headers?: object;
  readonly paramsSerializer?: (params?: object) => string;

  /**
   * Called before every request.
   * This hook could be useful if you want perform additional work before request,
   * or override request config.
   */
  readonly onBeforeRequest?: (
    this: HTTPClient,
    requestConfig: AxiosRequestConfig
  ) => RequestConfigOrNone | Promise<RequestConfigOrNone> | void;

  /**
   * Called after every request.
   * This hook could be useful if you want perform additional work after request,
   * or override pure server response.
   */
  readonly onAfterRequest?: (
    this: HTTPClient,
    response: AxiosResponse
  ) => AxiosResponse | Promise<AxiosResponse> | void;

  /**
   * Called after onAfterRequest hook.
   * This hook could be useful if you want
   * extract server response in some, specific way.
   */
  readonly transformResponse?: AxiosResponseTransformer | undefined;

  /**
   * Called on network error.
   * This hook could be useful if you want
   * to catch and do smth with network error object.
   */
  readonly onCatchNetworkError?: (
    this: HTTPClient,
    response: AxiosError
  ) => object | void;
}

/**
 * HTTP Client created as wrapper of axios library.
 * Can be used to performs post/get/put/delete http methods.
 * It has few hooks:
 * `onBeforeRequest`
 * `onAfterRequest`
 * `transformResponse`
 * `onCatchNetworkError`
 * that would be called on every request.
 * This hooks should be passed in constructor.
 * All of the hooks is optional.
 *
 * ### Example (es imports)
 * ```js
 * import {
 *  HTTPClient as HTTPClientCore,
 *  IRequestConfig
 * } from '@fanhubmedia/fe-common-utils';
 * import axios from 'axios';
 * import { CANCEL } from 'redux-saga';
 *
 * // Next code show an example of possible usage HTTPClient class with redux saga "cancel" request functionality.
 * // It's also adds additional data into all requests.
 *
 * class HTTPClient extends HTTPClientCore {
 *  public makeRequest(config: IRequestConfig): Promise<any> {
 * 	    const source = axios.CancelToken.source();
 *
 *  const request = super.makeRequest({
 * 	    ...config,
 * 	    params: {
 * 		    ...config.params,
 * 		    _: Date.now(),
 * 		    sid: localStorage.getItem('sid') || '',
 * 	    },
 * 	    cancelToken: source.token,
 *  });
 *
 *  request[CANCEL] = () => source.cancel();
 *
 *  return request;
 *  }
 * }
 *
 * // Example below show how to set all data as FormData representation.
 *
 * const APIClient = new HTTPClient({
 * 	baseURL: import.meta.env.REACT_APP_API_URL || '',
 * 	withCredentials: true,
 * 	transformRequest: [data => qs.stringify(data)],
 * });
 *
 * APIClient.post('login', credentials);
 * APIClient.get('user/show_my');
 *
 * const JSONClient = new HTTPClient({
 * 	baseURL: import.meta.env.REACT_APP_JSON_URL || '',
 * });
 *
 * JSONClient.get('players.json');
 * ```
 */
export class HTTPClient {
  private static getNormalizedNetworkError(networkError: AxiosError): {
    readonly code?: number;
    readonly message: string;
    readonly statusText?: string;
    readonly response?: AxiosResponse;
  } {
    const { message, response } = networkError;
    return {
      code: response ? response.status : 0,
      message,
      statusText: response ? response.statusText : '',
      response,
    };
  }

  private readonly config: IHTTPClientConfig;
  private readonly HttpClient: AxiosInstance;

  public get interceptors(): {
    readonly request: AxiosInterceptorManager<AxiosRequestConfig>;
    readonly response: AxiosInterceptorManager<AxiosResponse>;
  } {
    return this.HttpClient.interceptors;
  }

  constructor(config: IHTTPClientConfig) {
    this.config = config;

    bindAll(this, [
      'onBeforeRequest',
      'onAfterRequest',
      'transformResponse',
      'onCatchNetworkError',
    ]);

    this.HttpClient = axios.create(this.config);
  }

  /**
   * Override default config for current instance.
   */
  public extendDefaults(config: AxiosRequestConfig): this {
    merge({}, this.HttpClient.defaults, config);

    return this;
  }

  /**
   * Performs pure request without calling any hooks.
   */
  public request<T = any>(requestConfig: AxiosRequestConfig): Promise<T> {
    return this.HttpClient.request(requestConfig);
  }

  /**
   * Performs `get` http method with call of all existing hooks.
   */
  public get<T = any>(
    url: string,
    params?: object,
    requestConfig?: AxiosRequestConfig
  ): Promise<T> {
    return this.makeRequest({ params, url, ...requestConfig });
  }

  /**
   * Performs `delete` http method with call of all existing hooks.
   */
  public delete<T = any>(
    url: string,
    params?: object,
    requestConfig?: AxiosRequestConfig
  ): Promise<T> {
    return this.makeRequest({
      method: 'delete',
      params,
      url,
      ...requestConfig,
    });
  }

  /**
   * Performs `post` http method with call of all existing hooks.
   */
  public post<T = any>(
    url: string,
    params?: object,
    requestConfig?: AxiosRequestConfig
  ): Promise<T> {
    return this.makeRequest({
      data: params,
      method: 'post',
      url,
      ...requestConfig,
    });
  }

  /**
   * Performs `patch` http method with call of all existing hooks.
   */
  // tslint:disable-next-line:no-identical-functions
  public patch<T = any>(
    url: string,
    params?: object,
    requestConfig?: AxiosRequestConfig
  ): Promise<T> {
    return this.makeRequest({
      data: params,
      method: 'patch',
      url,
      ...requestConfig,
    });
  }

  /**
   * Performs `put` http method with call of all existing hooks.
   */
  // tslint:disable-next-line
  public put<T = any>(
    url: string,
    params?: object,
    requestConfig?: AxiosRequestConfig
  ): Promise<T> {
    return this.makeRequest({
      data: params,
      method: 'put',
      url,
      ...requestConfig,
    });
  }

  /**
   * Performs request with call of all existing hooks.
   */
  public async makeRequest<T = any>(
    requestConfig: AxiosRequestConfig
  ): Promise<T> {
    const config = await this.onBeforeRequest(requestConfig);

    return this.HttpClient.request({
      ...requestConfig,
      ...config,
    })
      .then(this.onAfterRequest)
      .then(this.transformResponse)
      .catch(this.onCatchNetworkError);
  }

  private async onBeforeRequest(
    requestConfig: AxiosRequestConfig
  ): Promise<RequestConfigOrNone> {
    const { onBeforeRequest } = this.config;

    if (isFunction(onBeforeRequest)) {
      return onBeforeRequest.call(this, requestConfig);
    }
  }

  private async onAfterRequest(
    response: AxiosResponse
  ): Promise<AxiosResponse> {
    const { onAfterRequest } = this.config;

    if (isFunction(onAfterRequest)) {
      return onAfterRequest.call(this, response) || response;
    }

    return response;
  }

  private async transformResponse(response: AxiosResponse): Promise<object> {
    const { transformResponse } = this.config;

    if (isFunction(transformResponse)) {
      return transformResponse.call(this, response) || response.data;
    }

    return response.data;
  }

  private async onCatchNetworkError(networkError: AxiosError): Promise<any> {
    const error = HTTPClient.getNormalizedNetworkError(networkError);
    const { onCatchNetworkError } = this.config;

    if (isFunction(onCatchNetworkError)) {
      return onCatchNetworkError.call(this, networkError) || error;
    }
    return error;
  }
}
