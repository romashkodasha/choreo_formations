import { ExtendedErrorResponse } from 'entities/api';

import { RootStoreType } from '../root';
import { ILocalStore } from 'shared/interfaces/ILocalStore';
import { ApiCallArgs, ApiCallResponse, ApiRequestParams, MetaState, MockApiCallResponse } from './types';

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  CancelToken,
} from 'axios';
import { action, computed, makeObservable, observable, runInAction } from 'mobx';
import { stringify } from 'qs';
import { formatToFormData } from 'utils/formatToFormData';

export class ApiRequest<
  ResponseData,
  ErrorResponse extends AxiosResponse = AxiosResponse
> implements ILocalStore
{
  private readonly _initParams: ApiRequestParams;
  private readonly _params: Partial<ApiCallArgs>;
  private readonly _axiosInstance: AxiosInstance;
  private _cancelToken: (() => void) | null = null;
  private _requestIndicator: CancelToken | null = null;
  private _meta = MetaState.initial;
  private _cancelOnDestroy: boolean = true;

  constructor(
    params: ApiRequestParams,
    private readonly _rootStore: RootStoreType
  ) {
    type PrivateFields = '_meta';

    makeObservable<this, PrivateFields>(this, {
      _meta: observable,
      meta: computed,
      isLoading: computed,
      isSuccess: computed,
      isFailed: computed,
      isLoaded: computed,
      axiosInstance: computed,
      cancel: action.bound,
      call: action.bound,
    });

    this._initParams = params;
    this._params = params.requestParams;
    this._axiosInstance = params.axiosInstance;

    if (params.cancelOnDestroy === false) {
      this._cancelOnDestroy = params.cancelOnDestroy;
    }
  }

  get meta(): MetaState {
    return this._meta;
  }

  get isLoading(): boolean {
    return this._meta === MetaState.loading;
  }

  get isSuccess(): boolean {
    return this._meta === MetaState.success;
  }

  get isFailed(): boolean {
    return this._meta === MetaState.failed;
  }

  get isLoaded(): boolean {
    return this._meta === MetaState.success || this._meta === MetaState.failed;
  }

  get axiosInstance(): AxiosInstance {
    return this._axiosInstance;
  }

  async call<
    T extends ResponseData = ResponseData,
    E extends ErrorResponse = ErrorResponse,
    R extends Record<string, unknown> | FormData = Record<string, unknown>
  >(
    params?: Partial<ApiCallArgs<R>> & {
      mockResponse?: MockApiCallResponse<T, E>;
    }
  ): Promise<ApiCallResponse<T, E>> {
    const mockResponse = params?.mockResponse;

    if (mockResponse) {
      const timeout = mockResponse.timeout;

      if (timeout !== undefined) {
        return new Promise<ApiCallResponse<T, E>>((resolve) => {
          setTimeout(() => {
            resolve(mockResponse);
          }, timeout);
        });
      }

      return mockResponse;
    }

    const cancelToken = this._createRequestCanceller();
    this._meta = MetaState.initial;
    // URL должен быть передан либо в параметрах конструктора, либо в параметрах вызова
    const url = params?.url ?? this._params.url;

    if (!url) {
      this._meta = MetaState.failed;

      return {
        isError: true,
      };
    }

    this._meta = MetaState.loading;

    const {
      params: initialParams,
      config: initialConfigField,
      ...initialConfig
    } = this._params;

    const {
      params: incomingParams,
      config: incomingConfigField = {},
      ...incomingConfig
    } = params ?? {};

    /** Обработка получения cookie при SSR */
    // if (params?.apiContext) {
    //   incomingConfigField.headers = {
    //     ...incomingConfigField.headers,
    //     cookie: getCookieHeader(params.apiContext),
    //   };
    // }

    /** Обработка преобразования в FormData */
    if (params?.multipartFormData) {
      const formData = formatToFormData(incomingConfig.data || {});

      incomingConfig.data = formData as R;

      incomingConfigField.headers = {
        ...incomingConfigField.headers,
        'Content-Type': 'multipart/form-data',
      };
    }

    const response = await this._callApi({
      url,
      method: this._params.method,
      config: {
        ...initialConfigField,
        ...initialConfig,
        ...incomingConfigField,
        ...incomingConfig,
        params: {
          ...initialParams,
          ...incomingParams,
        },
        cancelToken,
      },
      stringifyOptions: params?.stringifyOptions,
    });

    return runInAction(() => {
      const { meta, formattedResponse } =
        ApiRequest.createBaseResponseFromAxios<T, E>(response);

      this._meta = meta;

      return formattedResponse;
    });
  }

  private async _callApi<
    Data extends Record<string, unknown> | FormData = Record<string, unknown>
  >({
    url,
    method = 'GET',
    config,
    stringifyOptions,
  }: ApiCallArgs<Data>): Promise<AxiosResponse | AxiosError | undefined> {
    try {
      return await this._axiosInstance.request({
        ...config,
        url,
        method,
        paramsSerializer: (params) => {
          return stringify(params, {
            indices: false,
            arrayFormat: 'repeat',
            skipNulls: true,
            ...stringifyOptions,
          });
        },
      });
    } catch (error: unknown) {
      // eslint-disable-next-line no-console
      console.error('Axios Error', error);
      return error as AxiosError;
    }
  }

  cancel(): void {
    this._cancelToken?.();
    this._cancelToken = null;
    this._requestIndicator = null;
    this._meta = MetaState.initial;
  }

  destroy(): void {
    if (this._cancelOnDestroy) {
      this.cancel();
    }
  }

  reset(): void {
    this.cancel();
    this._meta = MetaState.initial;
  }

  clone(): ApiRequest<ResponseData> {
    return new ApiRequest<ResponseData>(this._initParams, this._rootStore);
  }

  private _createRequestCanceller(): CancelToken {
    this._cancelToken?.();

    // eslint-disable-next-line import/no-named-as-default-member
    this._requestIndicator = new axios.CancelToken((canceller) => {
      this._cancelToken = canceller;
    });

    return this._requestIndicator;
  }

  static createBaseResponseFromAxios<
    FormattedResponseData,
    FormattedErrorResponse,
  >(
    response: AxiosResponse | AxiosError | undefined,
  ): {
    meta: MetaState;
    formattedResponse: ApiCallResponse<
      FormattedResponseData,
      FormattedErrorResponse
    >;
  } {
    /** Обработка для ошибки AxiosError */
    if (response instanceof AxiosError) {
      const errorResponse = response.response as FormattedErrorResponse;

      return {
        meta: MetaState.failed,
        formattedResponse: {
          isError: true,
          data: errorResponse as FormattedErrorResponse,
          isCancelled: response.code === 'ERR_CANCELED',
          rawError: response,
        },
      };
    }

    if (!response || response.status >= 400) {
      return {
        meta: MetaState.failed,
        formattedResponse: {
          isError: true,
          data: response as FormattedErrorResponse,
        },
      };
    }

    return {
      meta: MetaState.success,
      formattedResponse: {
        isError: false,
        data: response.data as FormattedResponseData,
      },
    };
  }

  async fetch<
    T extends ResponseData = ResponseData,
    E extends ErrorResponse = ErrorResponse,
    R extends Record<string, unknown> | FormData = Record<string, unknown>,
  >(
    params?: Partial<ApiCallArgs<R>> & {
      mockResponse?: MockApiCallResponse<T, E>;
    }
  ): Promise<T | null> {
    const response = await this.call(params);

    if (!response.isError) {
      return response.data;
    }

    if ((response as ExtendedErrorResponse).isCancelled) {
      return null;
    }

    return null;
  }
}
