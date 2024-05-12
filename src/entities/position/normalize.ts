import { IPositionServer } from './server';
import { IPosition } from './client';

export const normalizePosition = (data: IPositionServer): IPosition => {
  return {
    id: data.id,
    dancerId: data.dancerId,
    positionX: data.positionX,
    positionY: data.positionY,
  };
};
