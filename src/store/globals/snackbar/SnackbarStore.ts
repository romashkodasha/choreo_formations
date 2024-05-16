import { action, computed, makeObservable, observable } from 'mobx';

import { DEFAULT_SNACKBAR_MESSAGES, SnackbarMessageType } from 'entities/snackbar';
import { IGlobalStore } from 'store/interfaces';

import { RootStoreType } from '../root';
import { ValueModel } from 'store/supportiveModels/ValueModel';

const SNACKBAR_TIMEOUT = 3000;

type PrivateType = '_snackbarTimeoutId';

export class SnackbarStore implements IGlobalStore {
  readonly snackbarMessage: ValueModel<SnackbarMessageType | null> =
    new ValueModel<SnackbarMessageType | null>(null);

  private _snackbarTimeoutId: NodeJS.Timeout | null = null;

  constructor(public readonly rootStore: RootStoreType) {
    makeObservable<this, PrivateType>(this, {
      _snackbarTimeoutId: observable,

      isSnackbarOpen: computed,

      openSnackbar: action,
      destroy: action,
    });
  }

  get isSnackbarOpen(): boolean {
    return Boolean(this.snackbarMessage.value);
  }

  readonly init = (): Promise<boolean> => {
    return Promise.resolve(true);
  };

  openSnackbar = (message?: SnackbarMessageType): void => {
    this.snackbarMessage.changeValue(message ?? DEFAULT_SNACKBAR_MESSAGES.error);

    if (this._snackbarTimeoutId) {
      clearTimeout(this._snackbarTimeoutId);
    }

    this._snackbarTimeoutId = setTimeout(() => {
      this.closeSnackbar();
    }, SNACKBAR_TIMEOUT);
  };

  triggerDefaultErrorMessage = (): void => {
    this.openSnackbar(DEFAULT_SNACKBAR_MESSAGES.error);
  };

  closeSnackbar = (): void => {
    this.snackbarMessage.changeValue(null);
  };

  readonly destroy = (): void => {
    if (this._snackbarTimeoutId) {
      clearTimeout(this._snackbarTimeoutId);

      this._snackbarTimeoutId = null;
    }
  };
}

export default SnackbarStore;
