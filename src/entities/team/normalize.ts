import { normalizeMember } from 'entities/member';
import { ITeam } from './client';
import { ITeamServer } from './server';

export const normalizeTeam = (data: ITeamServer): ITeam => {
  return {
    id: data.id,
    name: data.name,
    members: data.members.map(normalizeMember),
  };
};
