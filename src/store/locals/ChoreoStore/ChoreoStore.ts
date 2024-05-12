import { action, computed, makeObservable, observable, toJS } from 'mobx';
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

type PrivateType = '_projectDetail' | '_selectedFormation';

class ChoreoStore implements ILocalStore {
  private readonly _rootStore: RootStoreType;
  private _projectDetail: ProjectDetailModel | null;
  readonly meta = new MetaModel();
  private _selectedFormation: FormationModel | undefined;

  private readonly _requests: {
    loadProjectDetail: ApiRequest<
      { projectDetail: IProjectDetailServer },
      ErrorResponse
    >;
  };

  constructor(rootStore: RootStoreType) {
    this._rootStore = rootStore;
    this._projectDetail = null;
    this._selectedFormation = undefined;

    this._requests = {
      loadProjectDetail: this._rootStore.apiStore.createRequest({
        url: ENDPOINTS.loadProjectDetail.url,
        method: ENDPOINTS.loadProjectDetail.method,
      }),
    };

    makeObservable<ChoreoStore, PrivateType>(this, {
      _projectDetail: observable,
      _selectedFormation: observable,

      projectDetail: computed,
      formations: computed,
      members: computed,
      lastFormation: computed,
      selectedFormation: computed,

      updateFormation: action.bound,
      removeFormation: action,
      addDancer: action.bound,
      addFormation: action.bound,
      setSelectedFormation: action.bound,
      setPosition: action.bound,
      setProjectDetail: action.bound,
      getPositionByDancerId: action.bound,
    });
  }

  get projectDetail() {
    return this._projectDetail;
  }

  get formations() {
    return this._projectDetail?.formations;
  }


  get members() {
    return this._projectDetail?.team.members;
  }

  get isLoaded(): boolean {
    return this._requests.loadProjectDetail.isLoaded;
  }

  get isLoading(): boolean {
    return this._requests.loadProjectDetail.isLoading;
  }

  get selectedFormation(): FormationModel | undefined {
    return this._selectedFormation;
  }

  get lastFormation(): FormationModel | undefined {
    if (this.formations) return this.formations[this.formations?.length - 1];
  }

  setProjectDetail = (value: ProjectDetailModel | null) => {
    this._projectDetail = value;
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
      this.setProjectDetail(
        ChoreoStore.normalizeChoreo(response.data.projectDetail)
      );
      if (this.formations) this.setSelectedFormation(this.formations[0].sequenceNumber);
      this.meta.setLoadedSuccessMeta();
    }
  };

  static normalizeChoreo = (
    choreo: IProjectDetailServer
  ): ProjectDetailModel => {
    return ProjectDetailModel.fromJson({
      data: choreo as IProjectDetailServer,
    });
  };

  addFormation(timeStart: string, timeEnd: string) {
    const lastPositions: PositionModel[] = [];

    if (this.formations && this.lastFormation) {
      for (const position of this.lastFormation?.positions) {
        lastPositions.push(Object.assign({}, position));
      }
      const lastNumber = this.lastFormation.sequenceNumber;

      this._projectDetail?.formations?.push(new FormationModel({
        id: this.lastFormation.id + 1,
        sequenceNumber: lastNumber + 1,
        positions: lastPositions,
        timeStart: timeStart,
        timeEnd: timeEnd,
      }));
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
      this._selectedFormation?.positions.push({
        id:
          this._selectedFormation.positions[
            this._selectedFormation.positions.length - 1
          ].id + 1,
        dancerId: dancerID,
        positionX: 0,
        positionY: 0,
      });
    }
  }

  setSelectedFormation(sequenceNumber: number) {
    if (sequenceNumber) {
      this._selectedFormation = this.formations?.find(
        (formation) => formation.sequenceNumber === sequenceNumber
      );
    }
  }

  setPosition(dancerID: number, positionX: number, positionY: number) {
    const targetPosition = this.getPositionByDancerId(dancerID);

    //console.log(toJS(targetPosition), toJS(this.getPositionByDancerId(dancerID)));
    if (targetPosition) {
      targetPosition.positionX = positionX;
      targetPosition.positionY = positionY;
      // console.log(toJS(this.getPositionByDancerId(dancerID)))
    }
  }

  getPositionByDancerId(id: number) {
    return this.selectedFormation?.positions.find(
      (position) => position.dancerId === id
    );
  }

  destroy() {
    this._requests.loadProjectDetail.destroy();
  }
}

export default ChoreoStore;
