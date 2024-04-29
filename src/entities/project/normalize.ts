import { normalizeTeam } from 'entities/team';
import { IProject } from './client';
import { IProjectServer } from './server';

export const normalizeProject = (data: IProjectServer): IProject => {
  return {
    id: data.id,
    name: data.name,
    team: normalizeTeam(data.team),
    width: data.width,
    height: data.height,
  };
};
