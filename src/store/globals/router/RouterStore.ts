import { type NavigateFunction, type NavigateOptions } from 'react-router';

import { type RoutePath } from 'config/router';
import { type RootStoreType } from 'store/globals/root';
import { type IGlobalStore } from 'store/interfaces';

export class RouterStore implements IGlobalStore {
  /**
   * Поля, которые берутся из хуков react-router
   */
  private _navigate: NavigateFunction | null = null;

  constructor(public readonly rootStore: RootStoreType) {}

  readonly init = (navigate: NavigateFunction): Promise<boolean> => {
    this._navigate = navigate;

    return Promise.resolve(true);
  };

  readonly destroy = (): void => {};

  readonly push = (to: RoutePath, options?: NavigateOptions) => {
    this._navigate?.(to, options);
  };

  readonly replace = (to: RoutePath, options?: NavigateOptions) => {
    this._navigate?.(to, {
      ...options,
      replace: true,
    });
  };

  readonly goBack = () => {
    this._navigate?.(-1);
  };
}
