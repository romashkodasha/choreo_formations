import { action, computed, makeObservable, observable } from 'mobx';

import { LoadingStateEnum, LoadingStateModel } from '../LoadingStateModel';

import type { IListBase, EntitiesById } from './types';

export class ListModel<T, IdKey extends keyof T> implements IListBase<T, IdKey> {
  private _keys: T[IdKey][] = [];

  private _entities = {} as EntitiesById<T, IdKey>;

  readonly DISABLED_LOAD_MORE: boolean;

  private _isInitialLoad = false;

  private _hasMore = true;

  // TODO: если не будет нужно - удалить
  private readonly _loadingStageModel: LoadingStateModel = new LoadingStateModel();

  // TODO: если не будет нужно - удалить
  private readonly _creatingStageModel: LoadingStateModel = new LoadingStateModel();

  constructor(
    {
      keys,
      entities,
      disabledLoadMore = false,
    }: IListBase<T, IdKey> & { disabledLoadMore?: boolean } = {
      keys: [],
      entities: {} as EntitiesById<T, IdKey>,
    }
  ) {
    type PrivateFields = '_keys' | '_entities' | '_isInitialLoad' | '_hasMore';

    makeObservable<this, PrivateFields>(this, {
      _keys: observable,
      _entities: observable,
      _isInitialLoad: observable,
      _hasMore: observable,

      reset: action,
      removeEntity: action,
      removeEntities: action,
      addEntity: action,
      addEntities: action,
      setIsInitialLoad: action,
      setHasMore: action,

      keys: computed,
      entities: computed,
      length: computed,
      items: computed,
      isInitialLoad: computed,
      hasMore: computed,
      creatingStage: computed,
      loadingStage: computed,
    });

    this._keys = keys;
    this._entities = entities;
    this.DISABLED_LOAD_MORE = disabledLoadMore;
  }

  get keys(): T[IdKey][] {
    return this._keys;
  }

  get entities(): EntitiesById<T, IdKey> {
    return this._entities;
  }

  get items(): T[] {
    return this._keys.map((key) => this._entities[key]).filter(Boolean) as T[];
  }

  get length(): number {
    return this.items.length;
  }

  get isInitialLoad(): boolean {
    return this._isInitialLoad;
  }

  get hasMore(): boolean {
    return this.DISABLED_LOAD_MORE ? false : this._hasMore;
  }

  get loadingStage(): LoadingStateEnum {
    return this._loadingStageModel.state;
  }

  get creatingStage(): LoadingStateEnum {
    return this._creatingStageModel.state;
  }

  setIsInitialLoad = (value: boolean): void => {
    this._isInitialLoad = value;
  };

  setLoadingStage = (value: LoadingStateEnum): void => {
    this._loadingStageModel.setState(value);
  };

  setCreatingStage = (value: LoadingStateEnum): void => {
    this._creatingStageModel.setState(value);
  };

  setHasMore = (value: boolean): void => {
    this._hasMore = value;
  };

  static create<T, IdKey extends keyof T>(idKey: IdKey, items: T[]): ListModel<T, IdKey> {
    const keys = items.map((item) => item[idKey]);

    const entities = {} as EntitiesById<T, IdKey>;

    items.forEach((item) => {
      const id = item[idKey];

      (entities[id] as T) = item;
    });

    return new ListModel<T, IdKey>({ keys, entities });
  }

  readonly reset = (): void => {
    this._keys = [];
    this._entities = {} as EntitiesById<T, IdKey>;
  };

  readonly addEntity = ({
    entity,
    key,
    start = false,
  }: {
    entity: T;
    key: T[IdKey];
    start?: boolean;
  }): void => {
    (this._entities[key] as T) = entity;

    if (start) {
      this._keys.unshift(key);
    } else {
      this._keys.push(key);
    }
  };

  readonly addEntities = ({
    entities,
    keys,
    initial,
    start,
  }: IListBase<T, IdKey> & { initial: boolean; start?: boolean }): void => {
    if (initial) {
      this._entities = entities;
      this._keys = keys;

      return;
    }

    this._entities = {
      ...this._entities,
      ...entities,
    };

    if (start) {
      this._keys.unshift(...keys);
    } else {
      this._keys.push(...keys);
    }
  };

  readonly removeEntity = (keyParam: T[IdKey]): void => {
    this._keys = this._keys.filter((key) => key !== keyParam);
    delete this._entities[keyParam];
  };

  readonly removeEntities = (keyParams: T[IdKey][]): void => {
    keyParams.forEach(this.removeEntity);
  };

  readonly getEntity = (keyParam: T[IdKey]): T | null => {
    return this._entities[keyParam] ?? null;
  };

  readonly getEntityByIndex = (index: number): T | null => {
    const id = this.keys[index];

    return this.getEntity(id);
  };

  readonly getEntityAndIndex = (key: T[IdKey]): { entity: T; index: number } | null => {
    const entity = this.getEntity(key);
    const index = this.keys.indexOf(key);

    if (!entity || index === -1) {
      return null;
    }

    return { entity, index };
  };
}
