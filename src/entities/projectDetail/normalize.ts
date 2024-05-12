import { normalizeTeam } from 'entities/team';
import { IProjectDetail } from './client';
import { IProjectDetailServer } from './server';
import { normalizeFormation } from 'entities/formation';

export const normalizeProjectDetail = (
  data: IProjectDetailServer
): IProjectDetail => {
  return {
    id: data.id,
    name: data.name,
    team: normalizeTeam(data.team),
    formations: data.formations?.map(normalizeFormation),
    width: data.width,
    height: data.height,
  };
};
