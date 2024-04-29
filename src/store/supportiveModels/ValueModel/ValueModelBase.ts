import { action, computed, makeObservable, observable } from 'mobx';

export class ValueModelBase<T = string> {
  protected _value: T;
  protected _initialValue: T;

  constructor(value: T) {
    this._value = value;
    this._initialValue = value;

    makeObservable<this, '_value'>(this, {
      _value: observable,

      value: computed,

      changeValue: action.bound,
    });
  }

  get value(): T {
    return this._value;
  }

  changeValue(value: T): void {
    this._value = value;
  }

  reset(): void {
    this.changeValue(this._initialValue);
  }
}
