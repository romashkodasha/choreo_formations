import {
  IFormation,
  IFormationServer,
  normalizeFormation,
} from 'entities/formation';
import { PositionModel } from 'store/models/PositionModel';

export interface IFormationBase extends Omit<IFormation, 'positions'> {
  positions: PositionModel[];
}

export class FormationModel implements IFormationBase {
  readonly id: number;
  readonly sequenceNumber: number;
  readonly timeStart: string;
  readonly timeEnd: string;
  positions: PositionModel[];

  constructor(data: IFormationBase) {
    this.id = data.id;
    this.sequenceNumber = data.sequenceNumber;
    this.timeStart = data.timeStart;
    this.timeEnd = data.timeEnd;
    this.positions = data.positions;
  }

  static fromJson({ data }: { data: IFormationServer }): FormationModel {
    const formation = normalizeFormation(data);
    const positions = data.positions.map((position) =>
      PositionModel.fromJson({ data: position })
    );
    return new FormationModel({
      ...formation,
      positions: positions,
    }
    );
  }
}
