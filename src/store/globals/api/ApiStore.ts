import axios, {
  type AxiosResponse,
  type AxiosInstance,
  type CreateAxiosDefaults,
} from 'axios';

import type { ApiRequestParams, HttpAuthorizationDataType,  } from './types';
import { CommonHeaderKey, HttpAuthorizationScheme,  } from './types';

import { ApiRequest } from './ApiRequest';
import { RootStoreType } from 'store/globals/root';

// type ApiStoreParams = {
//   baseUrl?: string;
// } & Omit<CreateAxiosDefaults, 'baseUrl'>;

export class ApiStore {
  private _axiosInstance: AxiosInstance;

  constructor(private readonly _rootStore: RootStoreType) {
    this._axiosInstance = axios.create({
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      baseURL: '/',
      headers: {
        ['Content-Type']: 'application/json',
      },
    });

    this._axiosInstance.interceptors.response.use(
      (response) => ({
        ...response,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        data: response.data.data,
      }),
      (error) => {
        // eslint-disable-next-line no-console
        console.log('error: ', error);

        return Promise.reject(error);
      }
    );
  }

  setAuthorization({ scheme, data }: HttpAuthorizationDataType): void {
    if (!data) {
      return;
    }

    if (scheme === HttpAuthorizationScheme.Bearer) {
      this._axiosInstance.defaults.headers.common[
        CommonHeaderKey.Authorization
      ] = `${HttpAuthorizationScheme.Bearer} ${data}`;
    }
  }

  createRequest<
    ResponseData,
    ErrorResponse extends AxiosResponse = AxiosResponse
  >(
    requestParams: ApiRequestParams['requestParams'] = {}
  ): ApiRequest<ResponseData, ErrorResponse> {
    return new ApiRequest<ResponseData, ErrorResponse>(
      {
        requestParams,
        axiosInstance: this._axiosInstance,
      },
      this._rootStore
    );
  }
}
