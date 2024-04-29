import { IMember } from "entities/member";
import { ITeam, ITeamServer, normalizeTeam } from "entities/team";
import { MemberModel } from "store/models/MemberModel";
import { ListModel } from "store/supportiveModels/ListModel";

interface ITeamBase extends Omit<ITeam, 'members'>{
    members: ListModel<IMember, 'id'>;
}

export class TeamModel implements ITeamBase{
    readonly id: number;
    readonly name: string;
    readonly members: ListModel<IMember, 'id'>;

    constructor (data: ITeamBase){
        this.id = data.id;
        this.name = data.name;
        this.members = data.members;
    }

    static fromJson({data}: {data: ITeamServer}): TeamModel{
        const team = normalizeTeam(data);
        const members = data.members.map(member => MemberModel.fromJson({data: member}));
        return new TeamModel({
            ...team,
            members: ListModel.create('id', members)
        })
    }
}