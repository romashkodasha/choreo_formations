import { IPosition, IPositionServer, normalizePosition } from 'entities/position';
import { action, makeObservable, observable } from 'mobx';
import { MemberModel } from 'store/models/MemberModel';

export class PositionModel implements IPosition {
  readonly id: number;
  readonly member: MemberModel;
  positionX: number;
  positionY: number;

  constructor(data: IPosition) {
    makeObservable<this>(this, {
      positionX: observable,
      positionY: observable,
      updatePosition: action.bound,
    })
    
    this.id = data.id;
    this.member = new MemberModel(data.member);
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
