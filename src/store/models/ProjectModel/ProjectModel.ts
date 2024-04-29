import { IProject, IProjectServer, normalizeProject } from 'entities/project';
import { TeamModel } from 'store/models/TeamModel';

interface IProjectBase extends Omit<IProject, 'team'> {
  team: TeamModel;
}

export class ProjectModel implements IProjectBase {
  readonly id: number;
  readonly name: string;
  readonly team: TeamModel;
  readonly width: number;
  readonly height: number;

  constructor(data: IProjectBase) {
    this.id = data.id;
    this.name = data.name;
    this.team = data.team;
    this.width = data.width;
    this.height = data.height;
  }

  static fromJson({ data }: { data: IProjectServer }): ProjectModel {
    const project = normalizeProject(data);
    const team = TeamModel.fromJson({ data: data.team });

    return new ProjectModel({
      ...project,
      team,
    });
  }
}
