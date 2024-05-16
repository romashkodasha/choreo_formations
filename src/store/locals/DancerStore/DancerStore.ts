import { PositionModel } from 'store/models/PositionModel';
import { action, computed, makeObservable, observable } from 'mobx';
import { ILocalStore } from 'store/interfaces';


class DancerStore implements ILocalStore{
  private _position: PositionModel;
  updateChoreoPosition: (id: number, x: number, y: number) => void;

  constructor(position: PositionModel, updatePositions: (id: number, x: number, y: number) => void) {
    this._position = position;
    this.updateChoreoPosition = updatePositions;

    makeObservable<DancerStore, '_position'>(this, {
      _position: observable,
      position: computed,
      updatePosition: action.bound,
    });
  }

  get position() {
    return this._position;
  }

  updatePosition(x: number, y: number) {
    this._position.positionX = x;
    this._position.positionY = y;
    this.updateChoreoPosition(this.position.id, x, y)
  }

  destroy() {}

}

export default DancerStore;
