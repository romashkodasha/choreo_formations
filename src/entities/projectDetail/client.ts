import { IFormation } from 'entities/formation';
import { ITeam } from 'entities/team';

export interface IProjectDetail {
  id: number;
  name: string;
  team: ITeam;
  formations?: IFormation[];
  width: number;
  height: number;
}
