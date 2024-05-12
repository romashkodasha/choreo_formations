
import { ITeam, ITeamServer, normalizeTeam } from 'entities/team';
import { MemberModel } from 'store/models/MemberModel';

interface ITeamBase extends Omit<ITeam, 'members'> {
  members: MemberModel[];
}

export class TeamModel implements ITeamBase {
  readonly id: number;
  readonly name: string;
  readonly members: MemberModel[];

  constructor(data: ITeamBase) {
    this.id = data.id;
    this.name = data.name;
    this.members = data.members;
  }

  static fromJson({ data }: { data: ITeamServer }): TeamModel {
    const team = normalizeTeam(data);
    const members = data.members.map((member) =>
      MemberModel.fromJson({ data: member })
    );
    return new TeamModel({
      ...team,
      members: members,
    });
  }
}
