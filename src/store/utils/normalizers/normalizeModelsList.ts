import type { EntitiesById, IListBase, KeyLike } from 'store/supportiveModels/ListModel/types';
import { IdType } from 'store/types';

interface ModelClass<RawData, ModelInstance> {
  fromJson(data: { data: RawData }): ModelInstance;
}

function normalizeModelsList<
  Id extends KeyLike,
  RawData extends IdType<Id>,
  ModelInstance extends IdType<Id>,
>(data: RawData[], modelClass: ModelClass<RawData, ModelInstance>): IListBase<ModelInstance, 'id'> {
  return data.reduce(
    (acc, curr) => {
      return {
        entities: {
          ...acc.entities,
          [curr.id]: modelClass.fromJson({ data: curr }),
        },

        keys: [...acc.keys, curr.id],
      };
    },
    {
      entities: {} as EntitiesById<ModelInstance, 'id'>,
      keys: [] as Id[],
    }
  );
}

export { normalizeModelsList };
