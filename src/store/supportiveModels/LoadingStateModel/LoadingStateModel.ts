import { computed, makeObservable } from 'mobx';

import { ValueModelBase } from '../ValueModel';

export const enum LoadingStateEnum {
  INITIAL,
  LOADING,
  LOADED_SUCCESSFULLY,
  LOADED_WITH_ERROR,
}

export class LoadingStateModel {
  private _state = new ValueModelBase(LoadingStateEnum.INITIAL);

  constructor() {
    makeObservable<this>(this, {
      state: computed,
      initial: computed,
      loading: computed,
      loadedSuccessfully: computed,
      loadedWithError: computed,
    });
  }

  get state(): LoadingStateEnum {
    return this._state.value;
  }

  get initial(): boolean {
    return this._state.value === LoadingStateEnum.INITIAL;
  }

  get loading(): boolean {
    return this._state.value === LoadingStateEnum.LOADING;
  }

  get loadedSuccessfully(): boolean {
    return this._state.value === LoadingStateEnum.LOADED_SUCCESSFULLY;
  }

  get loadedWithError(): boolean {
    return this._state.value === LoadingStateEnum.LOADED_WITH_ERROR;
  }

  readonly reset = (): void => {
    this._state.reset();
  };

  readonly setLoading = (): void => {
    this._state.changeValue(LoadingStateEnum.LOADING);
  };

  readonly setLoadedSuccessfully = (): void => {
    this._state.changeValue(LoadingStateEnum.LOADED_SUCCESSFULLY);
  };

  readonly setLoadedWithError = (): void => {
    this._state.changeValue(LoadingStateEnum.LOADED_WITH_ERROR);
  };

  readonly setState = (value: LoadingStateEnum): void => {
    this._state.changeValue(value);
  };
}
