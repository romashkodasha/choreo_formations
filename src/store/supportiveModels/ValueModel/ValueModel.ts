import { action, computed, makeObservable } from 'mobx';

import { ValueModelBase } from './ValueModelBase';

export class ValueModel<T = string> extends ValueModelBase<T> {
  constructor(value: T) {
    super(value);

    makeObservable<this>(this, {
      touched: computed,
      resetTouched: action.bound,
    });
  }

  get touched(): boolean {
    return this._value !== this._initialValue;
  }

  resetTouched(): void {
    this._initialValue = this._value;
  }
}
