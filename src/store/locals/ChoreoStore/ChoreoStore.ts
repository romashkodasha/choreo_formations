import {
  action,
  computed,
  makeObservable,
  observable,
  reaction,
  runInAction,
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
import { PositionModel } from 'store/models/PositionModel';
import { IFormationServer } from 'entities/formation';
import { MemberModel } from 'store/models/MemberModel';
import dayjs from 'dayjs';

type PrivateType = '_project' | '_selectedFormationIndex';

class ChoreoStore implements ILocalStore {
  private readonly _rootStore: RootStoreType;
  private _project: ProjectDetailModel | null;
  readonly meta = new MetaModel();
  private _selectedFormationIndex: number;

  private readonly _requests: {
    loadProject: ApiRequest<{ project: IProjectDetailServer }, ErrorResponse>;
    editProject: ApiRequest<{ project: IProjectDetailServer }, ErrorResponse>;
  };

  constructor(rootStore: RootStoreType) {
    this._rootStore = rootStore;
    this._project = null;
    this._selectedFormationIndex = 0;

    this._requests = {
      loadProject: this._rootStore.apiStore.createRequest({
        url: ENDPOINTS.loadProject.url,
        method: ENDPOINTS.loadProject.method,
      }),
      editProject: this._rootStore.apiStore.createRequest({
        url: ENDPOINTS.editProject.url,
        method: ENDPOINTS.editProject.method,
      })
    };

    makeObservable<ChoreoStore, PrivateType>(this, {
      _project: observable,
      _selectedFormationIndex: observable,

      project: computed,
      formations: computed,
      members: computed,
      positions: computed,
      lastFormation: computed,
      selectedFormation: computed,
      selectedFormationIndex: computed,
      selectedFormationNumber: computed,
      currentPositions: computed,

      updateFormation: action.bound,
      removeFormation: action,
      addFormation: action.bound,
      setSelectedFormationNumber: action.bound,
      setSelectedFormationIndex: action.bound,
      setProjectDetail: action.bound,
      setFormations: action.bound,
    });

    reaction(
      () => this.project?.formations?.map((f) => f.timeStart), // Следим за изменениями timeStart в formations
      () => this.ensureTimeOrder()
    );
  }

  get project() {
    return this._project;
  }

  get formations() {
    return this._project?.formations;
  }

  get members() {
    return this._project?.team.members ?? [];
  }

  get positions() {
    if (this.formations?.length) {
      return this.formations[this.selectedFormationIndex]?.positions;
    } else return [];
  }

  get isLoaded(): boolean {
    return this._requests.loadProject.isLoaded;
  }

  get isLoading(): boolean {
    return this._requests.loadProject.isLoading;
  }

  get selectedFormation(): FormationModel | null {
    if (this.formations) return this.formations[this.selectedFormationIndex];
    else return null;
  }

  get selectedFormationIndex(): number {
    return this._selectedFormationIndex;
  }

  get selectedFormationNumber(): number {
    if (this.formations)
      return this.formations[this._selectedFormationIndex].sequenceNumber;
    else return 1;
  }

  get lastFormation(): FormationModel | undefined {
    if (this.formations?.length) return this.formations[this.formations?.length - 1];
  }

  get currentPositions(): PositionModel[] | undefined {
    if (this.formations?.length)
      return this.formations[this.selectedFormationIndex]?.positions;
  }

  setProjectDetail = (value: ProjectDetailModel | null) => {
    this._project = value;
  };

  setFormations = (formations: FormationModel[]) => {
    if (this._project) {
      this._project.setFormations(formations);
    }
  };

  setPositions = (positions: PositionModel[]) => {
    if (this._project && this._project.formations) {
      this._project.formations[this.selectedFormationIndex].positions =
        positions;
    }
  };

  loadProjectDetail = async ({ id }: { id: number }): Promise<void> => {
    if (this.meta.isLoading) {
      return;
    }

    this.meta.setLoadedStartMeta();

    const response = await this._requests.loadProject.call({
      params: {
        id,
      },
    });

    if (response.isError) {
      this.meta.setLoadedErrorMeta();
      return;
    } else {
      runInAction(() => {
        this.setProjectDetail(
          ChoreoStore.normalizeChoreo(response.data.project)
        );

        if (this._project?.formations?.length) {
          this.setFormations(
            ChoreoStore.normalizeFormations(response.data.project.formations)
          );
        } else {
          if (this.project) {
            this.setFormations([
              new FormationModel({
                id: 1,
                sequenceNumber: 1,
                timeStart: '00:00',
                timeEnd: '00:10',
                positions: this.project.team.members.map(
                  (member) =>
                    new PositionModel({
                      id: member.id,
                      member: new MemberModel({
                        id: member.id,
                        name: member.name,
                        color: member.color,
                      }),
                      positionX: 0,
                      positionY: 0,
                    })
                ),
              }),
            ]);
          }
        }

        this.meta.setLoadedSuccessMeta();
      });
    }
  };

  editProject = async () => {
    if (this._project) {
      await this._requests.editProject.call({
        params: {
          id: this._project.id,
        },
        data: this.project ?? {},
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

  addFormation() {
    if (this.formations) {
      this.setFormations([
        ...this.formations,
        new FormationModel({
          id: this.formations.length + 1,
          sequenceNumber: this.formations.length + 1,
          timeStart: this.formations.length ? this.formations[this.formations.length - 1].timeEnd : '00:00',
          timeEnd: this.formations.length ? dayjs(
            this.formations[this.formations.length - 1].timeEnd,
            'mm:ss'
          )
            .add(10, 'second')
            .format('mm:ss') : '00:10',
          positions: this.members.map(
            (member, index) =>
              new PositionModel({
                id: member.id,
                member: new MemberModel({
                  id: member.id,
                  name: member.name,
                  color: member.color,
                }),
                positionX: this.lastFormation?.positions[index]?.positionX ?? 0,
                positionY: this.lastFormation?.positions[index]?.positionY ?? 0,
              })
          ),
        }),
      ]);
    }
  }

  updateFormation(sequenceNumber: number, updatedFormation: FormationModel) {
    if (this.formations && this._project?.formations) {
      const index = this.formations.findIndex(
        (t: FormationModel) => t.sequenceNumber === sequenceNumber
      );
      if (index !== -1) {
        this._project.formations[index] = updatedFormation;
      }
    }
  }

  removeFormation(sequenceNumber: number) {
    if (this._project) {
      this._project.formations = this.formations?.filter(
        (t: FormationModel) => t.sequenceNumber !== sequenceNumber
      );
    }
  }

  setSelectedFormationNumber(sequenceNumber: number) {
    const index = this.formations?.findIndex(
      (formation) => formation.sequenceNumber === sequenceNumber
    );
    this._selectedFormationIndex = index ?? 0;
  }

  setSelectedFormationIndex(index: number) {
    this._selectedFormationIndex = index;
  }

  ensureTimeOrder() {
    if (this.formations)
      for (let i = 1; i < this.formations.length; i++) {
        const prevFormation = this.formations[i - 1];
        const currentFormation = this.formations[i];

        if (
          dayjs(currentFormation.timeStart, 'mm:ss').isBefore(
            dayjs(prevFormation.timeEnd, 'mm:ss')
          )
        ) {
          currentFormation.timeStart = prevFormation.timeEnd;
        }
      }
  }

  destroy() {
    this._requests.loadProject.destroy();
  }
}

export default ChoreoStore;
