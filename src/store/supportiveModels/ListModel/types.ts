export type KeyLike = string | number | symbol;

export type EntitiesById<T, IdKey extends keyof T> = T[IdKey] extends KeyLike
  ? Record<T[IdKey], T>
  : never;

export interface IListBase<T, IdKey extends keyof T> {
  readonly keys: T[IdKey][];
  readonly entities: EntitiesById<T, IdKey>;
}
