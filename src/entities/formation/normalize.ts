import { normalizePosition } from '../position';
import { IFormation } from './client';
import { IFormationServer } from './server';

export const normalizeFormation = (data: IFormationServer): IFormation => {
  return {
    id: data.id,
    sequenceNumber: data.sequenceNumber,
    timeStart: data.timeStart,
    timeEnd: data.timeEnd,
    positions: data.positions.map(normalizePosition),
  };
};
