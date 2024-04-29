import { IMember } from "entities/member";

export interface ITeam {
    id: number;
    name: string;
    members: IMember[];
}