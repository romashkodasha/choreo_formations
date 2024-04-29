import { ITeam } from "entities/team";

export interface IProject {
    id: number;
    name: string;
    team: ITeam;
    width: number;
    height: number;
}