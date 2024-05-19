
import { type NavigateFunction } from 'react-router';

import { AppStateModel } from 'store/models/AppStateModel';
import { initStoreContext } from 'utils/initStoreContext';


import { RouterStore } from '../router';
import { RoutePath } from 'config/router';
import { UserStore } from '../user';
import { ApiStore } from '../api';
import { SnackbarStore }from '../snackbar';
import { UIStore } from '../ui';

interface RootStoreInitProps {
  navigate: NavigateFunction;
}

class RootStore {
  private _isFirstInit = true;

  readonly appState = new AppStateModel();

  readonly apiStore = new ApiStore(this);
  readonly routerStore = new RouterStore(this);
  readonly snackbarStore = new SnackbarStore(this);
  readonly userStore = new UserStore(this);
  readonly uiStore = new UIStore();

  readonly reload = () => {
    this.appState.reset();
  };

  readonly init = async (initProps: RootStoreInitProps): Promise<boolean> => {
    if (!this.appState.initial) {
      return true;
    }

    this.appState.setLoading();

    const results = await Promise.all(this._getInitTasks(initProps));

    const success = results.every((ok) => ok);

    if (success) {
      this.appState.setLoadedSuccessfully();
    } else {
      this.appState.setLoadedWithError();
      this.routerStore.replace(RoutePath.error);
    }

    return success;
  };

  private readonly _getInitTasks = (initProps: RootStoreInitProps): Promise<boolean>[] => {
    const tasks: Promise<boolean>[] = [];

    if (this._isFirstInit) {
      tasks.push(this._firstInit());
      this._isFirstInit = false;
    }

    tasks.push(this.routerStore.init(initProps.navigate));
    tasks.push(this.userStore.init());

    return tasks;
  };

  private readonly _firstInit = async (): Promise<boolean> => {
    // todo: при необходимости добавить загрузку изображений
    // await loadImages(IMAGES);

    return true;
  };

  readonly destroy = (): void => {
    this.routerStore.destroy();
    this.userStore.destroy();
    this.snackbarStore.destroy();
  };
}

export type RootStoreType = RootStore;

export const {
  StoreContext: RootStoreContext,
  StoreProvider: RootStoreProvider,
  useStoreContext: useRootStore,
} = initStoreContext(() => new RootStore());
