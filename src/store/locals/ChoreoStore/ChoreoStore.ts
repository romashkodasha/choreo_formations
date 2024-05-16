import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
  toJS,
} from 'mobx';
import { FormationModel } from 'store/models/FormationModel';
import { ILocalStore } from 'store/interfaces';
import { ApiRequest } from 'store/globals/api';
import { ProjectDetailModel } from 'store/models/ProjectDetailModel';
import { IProjectDetailServer } from 'entities/projectDetail';
import { ErrorResponse } from 'store/types';
import { RootStoreType } from 'store/globals/root';
import { MetaModel } from 'store/models/MetaModel';
import { ENDPOINTS } from 'config/api';
import { MOCK_PROJECTS_DETAILS } from 'entities/mocks/projects';
import { PositionModel } from 'store/models/PositionModel';
import { IFormationServer } from 'entities/formation';

type PrivateType = '_projectDetail' | '_selectedFormationIndex' | '_formations';

class ChoreoStore implements ILocalStore {
  private readonly _rootStore: RootStoreType;
  private _projectDetail: ProjectDetailModel | null;
  private _formations: FormationModel[] | null;
  readonly meta = new MetaModel();
  private _selectedFormationIndex: number;

  private readonly _requests: {
    loadProjectDetail: ApiRequest<
      { projectDetail: IProjectDetailServer },
      ErrorResponse
    >;
  };

  constructor(rootStore: RootStoreType) {
    this._rootStore = rootStore;
    this._projectDetail = null;
    this._formations = null;
    this._selectedFormationIndex = 0;

    this._requests = {
      loadProjectDetail: this._rootStore.apiStore.createRequest({
        url: ENDPOINTS.loadProjectDetail.url,
        method: ENDPOINTS.loadProjectDetail.method,
      }),
    };

    makeObservable<ChoreoStore, PrivateType>(this, {
      _projectDetail: observable,
      _selectedFormationIndex: observable,
      _formations: observable,

      projectDetail: computed,
      formations: computed,
      members: computed,
      positions: computed,
      lastFormation: computed,
      selectedFormation: computed,
      selectedFormationIndex: computed,
      selectedFormationNumber: computed,
      currentPositions: computed,

      updateFormation: action.bound,
      updatePositions: action.bound,
      removeFormation: action,
      addDancer: action.bound,
      addFormation: action.bound,
      setSelectedFormationNumber: action.bound,
      setSelectedFormationIndex: action.bound,
      // setPosition: action.bound,
      setProjectDetail: action.bound,
      setFormations: action.bound,
      getPositionIndexByDancerId: action.bound,
    });
  }

  get projectDetail() {
    return this._projectDetail;
  }

  get formations() {
    return this._formations;
  }

  get members() {
    return this._projectDetail?.team.members;
  }

  get positions() {
    console.log('this.selectedFormationIndex', this.selectedFormationIndex);
    console.log('this.formations', toJS(this.formations));
    if (this.formations) {
      return this.formations[this.selectedFormationIndex].positions;
    } else return [];
  }

  get isLoaded(): boolean {
    return this._requests.loadProjectDetail.isLoaded;
  }

  get isLoading(): boolean {
    return this._requests.loadProjectDetail.isLoading;
  }

  get selectedFormation(): FormationModel | null {
    if (this._formations) return this._formations[this.selectedFormationIndex];
    else return null;
  }

  get selectedFormationIndex(): number {
    return this._selectedFormationIndex;
  }

  get selectedFormationNumber(): number {
    if (this._formations)
      return this._formations[this._selectedFormationIndex].sequenceNumber;
    else return 1;
  }

  get lastFormation(): FormationModel | undefined {
    if (this.formations) return this.formations[this.formations?.length - 1];
  }

  get currentPositions(): PositionModel[] | undefined {
    if (this._formations)
      return this._formations[this.selectedFormationIndex]?.positions;
  }

  setProjectDetail = (value: ProjectDetailModel | null) => {
    this._projectDetail = value;
  };

  setFormations = (formations: FormationModel[]) => {
    this._formations = formations;
    console.log(this._formations);
  };

  setPositions = (positions: PositionModel[]) => {
    if (this._formations) {
      this._formations[this.selectedFormationIndex].positions = positions;
    }
  };

  updatePositions = (id: number, newX: number, newY: number) => {
    // Находим позицию с заданным id и обновляем ее координаты
    const updatedPositions = this.positions.map((position) => {
      if (position.id === id) {
        return { ...position, positionX: newX, positionY: newY };
      }
      return position;
    });

    // Обновляем массив позиций
    this.setPositions(updatedPositions);
  };

  loadProjectDetail = async ({ id }: { id: number }): Promise<void> => {
    if (this.meta.isLoading) {
      return;
    }

    this.meta.setLoadedStartMeta();

    const response = await this._requests.loadProjectDetail.call({
      params: {
        id,
      },

      //todo: удалить после прикрутки бэка
      mockResponse: {
        data: { projectDetail: MOCK_PROJECTS_DETAILS[id - 1] },
        isError: false,
        timeout: 1000,
      },
    });

    if (response.isError) {
      this.meta.setLoadedErrorMeta();
      return;
    } else {
      runInAction(() => {
        this.setProjectDetail(
          ChoreoStore.normalizeChoreo(response.data.projectDetail)
        );

        this.setFormations(
          ChoreoStore.normalizeFormations(
            response.data.projectDetail.formations
          )
        );

        console.log('FORMATIONS', this.formations);

        this.meta.setLoadedSuccessMeta();
      });
    }
  };

  static normalizeChoreo = (
    choreo: IProjectDetailServer
  ): ProjectDetailModel => {
    return ProjectDetailModel.fromJson({
      data: choreo as IProjectDetailServer,
    });
  };

  static normalizeFormations = (formations: IFormationServer[] | undefined) => {
    if (formations)
      return formations.map((formation: IFormationServer) => {
        return FormationModel.fromJson({
          data: formation,
        });
      });
    else return [];
  };

  addFormation(timeStart: string, timeEnd: string) {
    const lastPositions: PositionModel[] = [];

    if (this.formations && this.lastFormation) {
      for (const position of this.lastFormation?.positions) {
        lastPositions.push(Object.assign({}, position));
      }
      const lastNumber = this.lastFormation.sequenceNumber;

      this._projectDetail?.formations?.push(
        new FormationModel({
          id: this.lastFormation.id + 1,
          sequenceNumber: lastNumber + 1,
          positions: lastPositions,
          timeStart: timeStart,
          timeEnd: timeEnd,
        })
      );
    }

    console.log(toJS(this._projectDetail));
  }

  updateFormation(sequenceNumber: number, updatedFormation: FormationModel) {
    if (this.formations && this._projectDetail?.formations) {
      const index = this.formations.findIndex(
        (t: FormationModel) => t.sequenceNumber === sequenceNumber
      );
      if (index !== -1) {
        this._projectDetail.formations[index] = updatedFormation;
      }
    }
  }

  removeFormation(sequenceNumber: number) {
    if (this._projectDetail) {
      this._projectDetail.formations = this.formations?.filter(
        (t: FormationModel) => t.sequenceNumber !== sequenceNumber
      );
    }
  }

  addDancer(name: string, color: string) {
    if (this.members) {
      const dancerID = this.members[this.members.length - 1].id + 1;
      this._projectDetail?.team.members.push({
        id: dancerID,
        name: name,
        color: color,
      });
      this.selectedFormation?.positions.push({
        id:
          this.selectedFormation.positions[
            this.selectedFormation.positions.length - 1
          ].id + 1,
        dancerId: dancerID,
        name,
        color,
        positionX: 0,
        positionY: 0,
      });
    }
  }

  setSelectedFormationNumber(sequenceNumber: number) {
    const index = this._formations?.findIndex(
      (formation) => formation.sequenceNumber === sequenceNumber
    );
    this._selectedFormationIndex = index ?? 0;
  }

  setSelectedFormationIndex(index: number) {
    this._selectedFormationIndex = index;
  }

  // setPosition(dancerID: number, positionX: number, positionY: number) {
  //   const targetPositionIndex = this.getPositionIndexByDancerId(dancerID);

  //   if (targetPositionIndex && this._formations) {
  //     this._formations[this.selectedFormationIndex].positions[
  //       targetPositionIndex
  //     ].positionX = positionX;
  //     this._formations[this.selectedFormationIndex].positions[
  //       targetPositionIndex
  //     ].positionY = positionY;
  //   }
  // }

  getPositionIndexByDancerId(id: number) {
    return this.selectedFormation?.positions.findIndex(
      (position) => position.dancerId === id
    );
  }

  destroy() {
    this._requests.loadProjectDetail.destroy();
  }
}

export default ChoreoStore;
