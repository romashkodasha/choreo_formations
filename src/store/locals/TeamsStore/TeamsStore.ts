import { ListModel } from 'store/supportiveModels/ListModel';
import { RootStoreType } from 'store/globals/root';
import { ILocalStore } from 'store/interfaces';
import { ErrorResponse, LoadInitialType } from 'store/types';
import { ApiRequest } from 'store/globals/api';
import { ENDPOINTS } from 'config/api/endpoints';
import { computed, makeObservable } from 'mobx';
import { MetaModel } from 'store/models/MetaModel';
import { normalizeModelsList } from 'store/utils';
import { MOCK_TEAMS } from 'entities/mocks/teams';
import { TeamModel } from 'store/models/TeamModel';
import { ITeamServer } from 'entities/team';

const TEAMS_LIMIT = 10;

class TeamsStore implements ILocalStore {
  private readonly _rootStore: RootStoreType;
  private readonly _teams = new ListModel<TeamModel, 'id'>();
  readonly meta = new MetaModel();

  private readonly _requests: {
    loadTeamsList: ApiRequest<{ teams: ITeamServer[] }, ErrorResponse>;
  };

  constructor(rootStore: RootStoreType) {
    this._rootStore = rootStore;

    this._requests = {
      loadTeamsList: this._rootStore.apiStore.createRequest({
        url: ENDPOINTS.teams.url,
        method: ENDPOINTS.teams.method,
      }),
    };

    makeObservable<TeamsStore>(this, {
      teams: computed,
    });
  }

  get teams() {
    return this._teams.items;
  }

  get isLoaded(): boolean {
    return this._requests.loadTeamsList.isLoaded;
  }

  get isLoading(): boolean {
    return this._requests.loadTeamsList.isLoading;
  }

  loadTeamsList = async ({
    initial = false,
  }: LoadInitialType): Promise<void> => {
    if (this.meta.isLoading) {
      return;
    }

    this.meta.setLoadedStartMeta();

    const response = await this._requests.loadTeamsList.call({
      params: {
        offset: initial ? 0 : this.teams.length,
        limit: TEAMS_LIMIT,
      },
      //todo: удалить после прикрутки бэка
      mockResponse: {
        data: { teams: MOCK_TEAMS },
        isError: false,
        timeout: 1000,
      },
    });

    if (response.isError) {
      this._teams.setIsInitialLoad(false);
      this.meta.setLoadedErrorMeta();

      return;
    } else {
      const { keys, entities } = TeamsStore.normalizeTeams(response.data.teams);

      this._teams.addEntities({
        entities,
        keys,
        initial,
      });

      this._teams.setHasMore(keys.length >= TEAMS_LIMIT);
      this._teams.setIsInitialLoad(true);
      this.meta.setLoadedSuccessMeta();
    }
  };

  static normalizeTeams = (
    data: ITeamServer[]
  ): { keys: number[]; entities: Record<number, TeamModel> } => {
    return normalizeModelsList<number, ITeamServer, TeamModel>(data, TeamModel);
  };

  destroy() {
    this._requests.loadTeamsList.destroy();
  }
}

export default TeamsStore;
