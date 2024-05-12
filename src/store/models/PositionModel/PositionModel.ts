import { IPosition, IPositionServer, normalizePosition } from 'entities/position';

export class PositionModel implements IPosition {
  readonly id: number;
  readonly dancerId: number;
  positionX: number;
  positionY: number;

  constructor(data: IPosition) {
    this.id = data.id;
    this.dancerId = data.dancerId;
    this.positionX = data.positionX;
    this.positionY = data.positionY;
  }

  static fromJson({ data }: { data: IPositionServer }): PositionModel {
    return new PositionModel(normalizePosition(data));
  }
}
