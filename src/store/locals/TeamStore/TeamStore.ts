import { RootStoreType } from 'store/globals/root';
import { ILocalStore } from 'store/interfaces';
import { ErrorResponse } from 'store/types';
import { ApiRequest } from 'store/globals/api';
import { ENDPOINTS } from 'config/api/endpoints';
import { action, computed, makeObservable, observable } from 'mobx';
import { MetaModel } from 'store/models/MetaModel';
import { MOCK_TEAMS } from 'entities/mocks/teams';
import { TeamModel } from 'store/models/TeamModel';
import { ITeamServer } from 'entities/team';

class TeamStore implements ILocalStore {
  private readonly _rootStore: RootStoreType;
  private _team: TeamModel | null;
  readonly meta = new MetaModel();

  private readonly _requests: {
    loadTeam: ApiRequest<{ team: ITeamServer }, ErrorResponse>;
    editTeam: ApiRequest<{ data: 'ok' }, ErrorResponse>;
    deleteTeam: ApiRequest<{ data: 'ok' }, ErrorResponse>;
    createTeam: ApiRequest<{ data: 'ok' }, ErrorResponse>;
  };

  constructor(rootStore: RootStoreType) {
    this._rootStore = rootStore;
    this._team = null;

    this._requests = {
      loadTeam: this._rootStore.apiStore.createRequest({
        url: ENDPOINTS.loadTeam.url,
        method: ENDPOINTS.loadTeam.method,
      }),
      editTeam: this._rootStore.apiStore.createRequest({
        url: ENDPOINTS.editTeam.url,
        method: ENDPOINTS.editTeam.method,
      }),
      deleteTeam: this._rootStore.apiStore.createRequest({
        url: ENDPOINTS.deleteTeam.url,
        method: ENDPOINTS.deleteTeam.method,
      }),
      createTeam: this._rootStore.apiStore.createRequest({
        url: ENDPOINTS.createTeam.url,
        method: ENDPOINTS.createTeam.method,
      }),
    };

    makeObservable<TeamStore, '_team'>(this, {
      _team: observable.ref,
      team: computed,
      setTeam: action
    });
  }

  get team() {
    return this._team;
  }

  get isLoaded(): boolean {
    return this._requests.loadTeam.isLoaded;
  }

  get isLoading(): boolean {
    return this._requests.loadTeam.isLoading;
  }

  setTeam = (value: TeamModel | null) => {
    this._team = value;
  };

  loadTeam = async ({ id }: { id: number }): Promise<void> => {
    if (this.meta.isLoading) {
      return;
    }

    this.meta.setLoadedStartMeta();

    const response = await this._requests.loadTeam.call({
      params: {
        id,
      },
      //todo: удалить после прикрутки бэка
      mockResponse: {
        data: { team: MOCK_TEAMS[id - 1] },
        isError: false,
        timeout: 1000,
      },
    });

    if (response.isError) {
      this.meta.setLoadedErrorMeta();

      return;
    } else {
      this.setTeam(TeamStore.normalizeTeam(response.data.team));
      this.meta.setLoadedSuccessMeta();
    }
  };

  static normalizeTeam = (team: ITeamServer): TeamModel => {
    return TeamModel.fromJson({ data: team as ITeamServer });
  };

  destroy() {
    this._requests.loadTeam.destroy();
  }
}

export default TeamStore;
