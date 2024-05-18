export interface IMember {
    name: string;
    color: string;
}

export interface ITeam {
    name: string;
    members: IMember[];
}
