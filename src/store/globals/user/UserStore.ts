import { ENDPOINTS } from 'config/api/endpoints';
import { API_READY_STATE } from 'config/api/readyState';
import { action, computed, makeObservable, observable, toJS } from 'mobx';
import { IGlobalStore } from 'store/interfaces';
import { RootStoreType } from 'store/globals/root';
import {
  ApiAuth,
  ApiUser,
  UserModel,
  AuthData,
  RegisterData,
} from 'store/models/UserModel';
import { ApiRequest } from '../api/ApiRequest';
import { MetaModel } from 'store/models/MetaModel';
import { SnackbarMessageGoalsType } from 'entities/snackbar';
import { RoutePath } from 'config/router';
import { ErrorResponse } from 'store/types';

export class UserStore implements IGlobalStore {
  private readonly _rootStore: RootStoreType;
  private _user: UserModel | null = null;
  private _requests: {
    auth: ApiRequest<ApiAuth>;
    register: ApiRequest<ApiAuth>;
    user: ApiRequest<{user: ApiUser}, ErrorResponse>;
  };
  readonly meta = new MetaModel();

  get user(): UserModel | null {
    return this._user;
  }

  constructor(public readonly rootStore: RootStoreType) {
    this._rootStore = rootStore;
    this._requests = {
      auth: this.rootStore.apiStore.createRequest({
        url: ENDPOINTS.auth.url,
        method: ENDPOINTS.auth.method,
      }),
      register: this.rootStore.apiStore.createRequest({
        url: ENDPOINTS.register.url,
        method: ENDPOINTS.register.method,
      }),
      user: this.rootStore.apiStore.createRequest<{user: ApiUser}>({
        url: ENDPOINTS.user.url,
        method: ENDPOINTS.user.method,
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
      this._rootStore.routerStore.replace(RoutePath.auth);
      return true;
    }

    console.log(toJS(user));


    this._setUser(user);
    this._rootStore.routerStore.replace(RoutePath.root);

    return true;
  };

  readonly destroy = (): void => {
    this._setUser(null);
  };

  private readonly _authorizeMock = (): Promise<UserModel | null> => {
    return Promise.resolve(
      new UserModel({
        id: 1,
        name: 'Tester',
        email: 'tester@tester.com',
      })
    );
  };

  private readonly _authorizeInit = async (): Promise<UserModel | null> => {
    const response = await this._requests.user.fetch();
    console.log('autorizeInit')

    if (response?.user) {
      return UserModel.fromJson(response.user);
    } else {
      return null;
    }
  };

  readonly register = async ({
    name,
    password,
    email,
  }: RegisterData): Promise<UserModel | null> => {
    this.meta.setLoadedStartMeta();
    const payload = {
      name,
      password,
      email,
    };

    if (API_READY_STATE.register) {
      const response = await this._requests.register.fetch({ data: payload });

      if (!response?.user) {
        this.meta.setLoadedErrorMeta();

        this.rootStore.snackbarStore.openSnackbar({
          text: 'Произошла ошибка при регистрации, проверьте правильность введенных данных',
          goal: SnackbarMessageGoalsType.error,
        });

        return null;
      }

      return UserModel.fromJson(response.user);
    }
    return null;
  };

  readonly login = async ({
    email,
    password,
  }: AuthData): Promise<UserModel | null> => {
    this.meta.setLoadedStartMeta();
    const payload = {
      email,
      password,
    };

    if (API_READY_STATE.auth) {
      const response = await this._requests.auth.fetch({ data: payload });

      if (!response?.user) {
        this.meta.setLoadedErrorMeta();
        return null;
      }

      this.meta.setLoadedSuccessMeta();
      this._rootStore.routerStore.push(RoutePath.root);

      return UserModel.fromJson(response.user);
    } else {
      this.meta.setLoadedSuccessMeta();
      return this._authorizeMock();
    }
  };
}
