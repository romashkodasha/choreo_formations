import { action, computed, makeObservable, observable, toJS } from 'mobx';
import { DancerType, FormationModel } from './types';
import { testFormations, testDancers } from 'consts/testData';

type PrivateType = '_formations' | '_dancers' | '_selectedFormation';

class ChoreoStore {
  private _formations: FormationModel[];
  private _dancers: DancerType[];
  private _selectedFormation: FormationModel | undefined;

  constructor() {
    this._formations = [];
    this._dancers = [];
    this._selectedFormation = undefined;

    makeObservable<ChoreoStore, PrivateType>(this, {
      _formations: observable,
      _dancers: observable,
      _selectedFormation: observable,

      formations: computed,
      dancers: computed,
      selectedFormation: computed,

      getFormationsList: action,
      updateFormation: action,
      removeFormation: action,
      addDancer: action.bound,
      addFormation: action.bound,
      setSelectedFormation: action.bound,
      setPosition: action.bound,
    });
  }

  get formations(): FormationModel[] {
    return this._formations;
  }

  get dancers(): DancerType[] {
    return this._dancers;
  }

  get selectedFormation(): FormationModel | undefined {
    return this._selectedFormation;
  }

  async getFormationsList(): Promise<void> {
    this._formations = testFormations;
    this._dancers = testDancers;
    this._selectedFormation = this._formations[0];
  }

  addFormation(timeStart: string, timeEnd: string) {
    const lastPositions = [];
    for (const position of this.formations[this.formations.length - 1]
      .positions) {
      lastPositions.push(Object.assign({}, position));
    }
    const lastNumber =
      this.formations[this.formations.length - 1].sequenceNumber;

    this._formations?.push({
      sequenceNumber: lastNumber + 1,
      positions: lastPositions,
      timeStart: timeStart,
      timeEnd: timeEnd,
    });
  }

  updateFormation(sequenceNumber: number, updatedFormation: FormationModel) {
    const index = this.formations.findIndex(
      (t) => t.sequenceNumber === sequenceNumber
    );
    if (index !== -1) {
      this.formations[index] = updatedFormation;
    }
  }

  removeFormation(sequenceNumber: number) {
    this._formations = this.formations.filter(
      (t) => t.sequenceNumber !== sequenceNumber
    );
  }

  addDancer(name: string, color: string) {
    const dancerID = this.dancers[this.dancers.length - 1].dancerID + 1;
    this._dancers?.push({
      dancerID: dancerID,
      name: name,
      color: color,
    });
    this._selectedFormation?.positions.push({
      dancerID: dancerID,
      position_x: 0,
      position_y: 0,
    });
  }

  setSelectedFormation(sequenceNumber: number) {
    if (sequenceNumber) {
      this._selectedFormation = this.formations.find(
        (formation) => formation.sequenceNumber === sequenceNumber
      );
    }
  }

  setPosition(dancerID: number, position_x: number, position_y: number) {
    const targetPosition = this.selectedFormation?.positions.find(
      (position) => position.dancerID === dancerID
    );
    if (targetPosition) {
      targetPosition.position_x = position_x;
      targetPosition.position_y = position_y;
      console.log(
        toJS(
          this.selectedFormation?.positions.find(
            (position) => position.dancerID === dancerID
          )
        )
      );
    }
  }

  destroy() {
    this._formations = [];
  }
}

export default ChoreoStore;
