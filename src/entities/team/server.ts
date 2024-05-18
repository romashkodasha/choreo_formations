import { IMemberServer } from 'entities/member';

export interface ITeamServer {
  id: number;
  name: string;
  members?: IMemberServer[];
}
