import { ENDPOINTS } from 'config/api/endpoints';
import { API_READY_STATE } from 'config/api/readyState';
import { action, computed, makeObservable, observable } from 'mobx';
import { IGlobalStore } from 'store/interfaces';
import { HttpAuthorizationScheme } from 'store/globals/api/types';
import { RootStoreType } from 'store/globals/root';
import {
  ApiAuth,
  ApiUser,
  UserModel,
  AuthData,
  AuthLocalStorageKey,
} from 'store/models/UserModel';
import { ApiRequest } from '../api/ApiRequest';
import { MetaModel } from 'store/models/MetaModel';

export class UserStore implements IGlobalStore {
  private _user: UserModel | null = null;
  private _requests: {
    auth: ApiRequest<ApiAuth>;
  };
  readonly meta = new MetaModel();

  get user(): UserModel | null {
    return this._user;
  }

  constructor(public readonly rootStore: RootStoreType) {
    this._requests = {
      auth: this.rootStore.apiStore.createRequest<ApiUser>({
        url: ENDPOINTS.auth.url,
        method: ENDPOINTS.auth.method,
      }),
    };
    makeObservable<this, '_user' | '_setUser'>(this, {
      _user: observable.ref,
      meta: observable.ref,
      user: computed,
      _setUser: action.bound,
    });
  }

  private readonly _setUser = (user: UserModel | null): void => {
    this._user = user;
  };

  readonly init = async (): Promise<boolean> => {
    const user = await (API_READY_STATE.auth
      ? this._authorizeInit
      : this._authorizeMock)();

    if (!user) {
      return false;
    }

    this._setUser(user);

    return true;
  };

  readonly destroy = (): void => {
    this._setUser(null);
  };

  private readonly _authorizeMock = (): Promise<UserModel | null> => {
    return Promise.resolve(
      new UserModel({
        id: 1,
        username: 'Tester',
      })
    );
  };

  // todo: проверить работу при прикрутке бэка
  private readonly _authorizeInit = async (): Promise<UserModel | null> => {
    const accessToken = localStorage.getItem(AuthLocalStorageKey.accessToken);

    if (!accessToken) {
      return null;
    }

    this.rootStore.apiStore.setAuthorization({
      scheme: HttpAuthorizationScheme.Bearer,
      data: accessToken,
    });

    const response = await this._requests.auth.fetch();

    if (!response?.user) {
      return null;
    }

    return UserModel.fromJson(response.user);
  };

  readonly login = async ({
    username,
    password,
    rememberMe,
  }: AuthData): Promise<UserModel | null> => {
    this.meta.setLoadedStartMeta();
    const payload = {
      username,
      password,
    };

    if (API_READY_STATE.auth) {
      const response = await this._requests.auth.fetch({ data: payload });

      if (response?.token) {
        this.rootStore.apiStore.setAuthorization({
          scheme: HttpAuthorizationScheme.Bearer,
          data: response.token,
        });
        if (rememberMe) {
          localStorage.setItem(AuthLocalStorageKey.accessToken, response.token);
        }
        this.meta.setLoadedSuccessMeta();
      }

      if (!response?.user) {
        this.meta.setLoadedErrorMeta();
        return null;
      }


      return UserModel.fromJson(response.user);
    } else {
      this.meta.setLoadedSuccessMeta();
      return this._authorizeMock();
    }
  };
}
