import { IFormationServer } from 'entities/formation';
import { ITeam } from 'entities/team';

export interface IProjectDetailServer {
  id: number;
  name: string;
  team: ITeam;
  formations: IFormationServer[];
  width: number;
  height: number;
}
