import { makeObservable, computed, action, observable } from 'mobx';

export class ModalModel {
  private _isOpen: boolean = false;
  constructor() {
    makeObservable<this, '_isOpen'>(this, {
      _isOpen: observable,
      isOpen: computed,
      open: action.bound,
      close: action.bound,
    });
  }

  get isOpen(): boolean {
    return this._isOpen;
  }

  readonly open = () => {
    this._isOpen = true;
  };

  readonly close = () => {
    this._isOpen = false;
  };
}
