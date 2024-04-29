import { ITeamServer } from "entities/team";

export interface IProjectServer {
    id: number;
    name: string;
    team: ITeamServer;
    width: number;
    height: number;
}