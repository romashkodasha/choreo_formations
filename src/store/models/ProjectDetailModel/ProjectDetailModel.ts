import {
  IProjectDetail,
  IProjectDetailServer,
  normalizeProjectDetail,
} from 'entities/projectDetail';
import { TeamModel } from 'store/models/TeamModel';
import { FormationModel } from 'store/models/FormationModel';

interface IProjectDetailBase
  extends Omit<IProjectDetail, 'team' | 'formations'> {
  team: TeamModel;
  formations: FormationModel[] | undefined;
}

export class ProjectDetailModel implements IProjectDetailBase {
  readonly id: number;
  readonly name: string;
  readonly team: TeamModel;
  formations: FormationModel[] | undefined;
  readonly width: number;
  readonly height: number;

  constructor(data: IProjectDetailBase) {
    this.id = data.id;
    this.name = data.name;
    this.team = data.team;
    this.formations = data.formations;
    this.width = data.width;
    this.height = data.height;
  }

  static fromJson({
    data,
  }: {
    data: IProjectDetailServer;
  }): ProjectDetailModel {
    const project = normalizeProjectDetail(data);
    const team = TeamModel.fromJson({ data: data.team });
    const formations = data.formations?.map((formation) =>
      FormationModel.fromJson({ data: formation })
    );

    return new ProjectDetailModel({
      ...project,
      team: team,
      formations: formations? formations : undefined,
    });
  }
}
