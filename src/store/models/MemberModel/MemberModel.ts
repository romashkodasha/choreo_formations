import { IMember, IMemberServer, normalizeMember } from 'entities/member';

export class MemberModel implements IMember {
  readonly id: number;
  readonly name: string;
  readonly color: string;

  constructor(data: IMember) {
    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
  }

  static fromJson({ data }: { data: IMemberServer }): MemberModel {
    return new MemberModel(normalizeMember(data));
  }
}
