import { IPosition, IPositionServer, normalizePosition } from 'entities/position';
import { action, makeObservable, observable } from 'mobx';

export class PositionModel implements IPosition {
  readonly id: number;
  readonly dancerId: number;
  color: string;
  name: string;
  positionX: number;
  positionY: number;

  constructor(data: IPosition) {
    makeObservable<this>(this, {
      positionX: observable,
      positionY: observable,
      updatePosition: action.bound,
    })
    
    this.id = data.id;
    this.dancerId = data.dancerId;
    this.color = data.color;
    this.name = data.name;
    this.positionX = data.positionX;
    this.positionY = data.positionY;
  }

  updatePosition = (x: number, y: number) => {
    this.positionX = x;
    this.positionY = y;
  }

  static fromJson({ data }: { data: IPositionServer }): PositionModel {
    return new PositionModel(normalizePosition(data));
  }
}
