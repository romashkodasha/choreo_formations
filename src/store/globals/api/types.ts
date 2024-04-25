export enum MetaState {
  initial = 'initial',
  loading = 'loading',
  success = 'success',
  failed = 'failed',
}

import { IncomingMessage, ServerResponse } from 'http';

import type {
  AxiosInstance,
  AxiosRequestConfig,
  Method,
  AxiosError,
} from 'axios';

import { IStringifyOptions } from 'qs';

export type ApiContext = {
  /**
   * `HTTP` request object.
   */
  req?: IncomingMessage;
  /**
   * `HTTP` response object.
   */
  res?: ServerResponse;
};

export type ApiCallResponse<D = undefined, E = undefined> =
  | {
      isError: true;
      data?: E;
    }
  | {
      isError: true;
      data?: E;
      isCancelled: boolean;
      rawError: AxiosError;
    }
  | {
      isError: false;
      data: D;
    };

export type MockApiCallResponse<D = undefined, E = undefined> = ApiCallResponse<
  D,
  E
> & { timeout?: number };

export type ApiCallArgs<
  Data extends Record<string, unknown> | FormData = Record<string, unknown>
> = {
  /**
   * Api endpoint — абсолютный путь
   */
  url: string;
  /**
   * HTTP-метод: 'GET', 'POST' и т.д.
   */
  method?: Method;
  /**
   * Данные в body
   */
  data?: Data;
  /**
   * Query-параметры
   */
  params?: Record<string, unknown>;
  /**
   * Конфиг axios
   */
  config?: Omit<AxiosRequestConfig<Data>, 'url' | 'method'>;
  /**
   * Нужно ли преобразовывать данные в multipart/form-data
   */
  multipartFormData?: boolean;
  /**
   * ApiContext при использовании SSR
   */
  apiContext?: ApiContext;
  /**
   * Параметры для вызова метода stringify.
   * В основном используется чтобы корректно обрабатывать формат отправки массива на бэк
   */
  stringifyOptions?: IStringifyOptions;
};

export type ApiRequestParams = {
  requestParams: Partial<ApiCallArgs>;
  axiosInstance: AxiosInstance;
  authToken?: string;
  /** Нужно ли отменять запрос в случае срабатывания метода destroy */
  cancelOnDestroy?: boolean;
};

export enum CommonHeaderKey {
  Authorization = 'Authorization',
}

export enum HttpAuthorizationScheme {
  Bearer = 'Bearer',
}

type HttpAuthorizationBearer = {
  scheme: HttpAuthorizationScheme.Bearer;
  data: string;
};

export type HttpAuthorizationDataType = HttpAuthorizationBearer;

export type GetAuthorizationCallback = () => HttpAuthorizationDataType | null;
