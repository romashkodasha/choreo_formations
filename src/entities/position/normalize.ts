import { IPositionServer } from './server';
import { IPosition } from './client';
import { normalizeMember } from 'entities/member';

export const normalizePosition = (data: IPositionServer): IPosition => {
  return {
    id: data.id,
    member: normalizeMember(data.member),
    positionX: data.positionX,
    positionY: data.positionY,
  };
};
