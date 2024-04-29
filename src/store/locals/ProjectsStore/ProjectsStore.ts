import { ProjectModel } from 'store/models/ProjectModel';
import { ListModel } from 'store/supportiveModels/ListModel';
import { RootStoreType } from 'store/globals/root';
import { ILocalStore } from 'store/interfaces';
import { IProjectServer } from 'entities/project';
import { ErrorResponse, LoadInitialType } from 'store/types';
import { ApiRequest } from 'store/globals/api';
import { ENDPOINTS } from 'config/api/endpoints';
import { computed, makeObservable } from 'mobx';
import { MetaModel } from 'store/models/MetaModel';
import { normalizeModelsList } from 'store/utils';
import { MOCK_PROJECTS } from 'entities/mocks/projects';
import { MOCK_TEAMS } from 'entities/mocks/teams';
import { ValueModel } from 'store/supportiveModels/ValueModel';
import { OptionsEnum } from 'config/options';
import { TeamModel } from 'store/models/TeamModel';
import { ITeamServer } from 'entities/team';

const PROJECTS_LIMIT = 10;
const TEAMS_LIMIT = 10;

class ProjectsStore implements ILocalStore {
  private readonly _rootStore: RootStoreType;
  private readonly _projects = new ListModel<ProjectModel, 'id'>();
  private readonly _teams = new ListModel<TeamModel, 'id'>();
  readonly metaProjects = new MetaModel();
  readonly metaTeams = new MetaModel();
  readonly filter = new ValueModel<string>(OptionsEnum.projects);

  private readonly _requests: {
    loadProjectsList: ApiRequest<{ projects: IProjectServer[] }, ErrorResponse>;
    loadTeamsList: ApiRequest<{ teams: ITeamServer[] }, ErrorResponse>;
  };

  constructor(rootStore: RootStoreType) {
    this._rootStore = rootStore;

    this._requests = {
      loadProjectsList: this._rootStore.apiStore.createRequest({
        url: ENDPOINTS.projects.url,
        method: ENDPOINTS.projects.method,
      }),
      loadTeamsList: this._rootStore.apiStore.createRequest({
        url: ENDPOINTS.teams.url,
        method: ENDPOINTS.teams.method,
      }),
    };

    makeObservable<ProjectsStore>(this, {
      projects: computed,
      teams: computed,
    });
  }

  get projects() {
    return this._projects.items;
  }

  get teams() {
    return this._teams.items;
  }

  get isProjectsLoaded(): boolean {
    return this._requests.loadProjectsList.isLoaded;
  }

  get isProjectsLoading(): boolean {
    return this._requests.loadProjectsList.isLoading;
  }

  get isTeamsLoaded(): boolean {
    return this._requests.loadTeamsList.isLoaded;
  }

  get isTeamsLoading(): boolean {
    return this._requests.loadTeamsList.isLoading;
  }

  loadProjectsList = async ({
    initial = false,
  }: LoadInitialType): Promise<void> => {
    if (this.metaProjects.isLoading) {
      return;
    }

    this.metaProjects.setLoadedStartMeta();

    const response = await this._requests.loadProjectsList.call({
      params: {
        offset: initial ? 0 : this.projects.length,
        limit: PROJECTS_LIMIT,
      },
      //todo: удалить после прикрутки бэка
      mockResponse: {
        data: { projects: MOCK_PROJECTS },
        isError: false,
        timeout: 1000,
      },
    });

    if (response.isError) {
      this._projects.setIsInitialLoad(false);
      this.metaProjects.setLoadedErrorMeta();

      return;
    } else {
      const { keys, entities } = ProjectsStore.normalizeProjects(
        response.data.projects
      );

      this._projects.addEntities({
        entities,
        keys,
        initial,
      });

      console.log(this.projects[0]);

      this._projects.setHasMore(keys.length >= PROJECTS_LIMIT);
      this._projects.setIsInitialLoad(true);
      this.metaProjects.setLoadedSuccessMeta();
    }
  };

  loadTeamsList = async ({
    initial = false,
  }: LoadInitialType): Promise<void> => {
    if (this.metaTeams.isLoading) {
      return;
    }

    this.metaTeams.setLoadedStartMeta();

    const response = await this._requests.loadTeamsList.call({
      params: {
        offset: initial ? 0 : this.projects.length,
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
      this.metaTeams.setLoadedErrorMeta();

      return;
    } else {
      const { keys, entities } = ProjectsStore.normalizeTeams(
        response.data.teams
      );

      this._teams.addEntities({
        entities,
        keys,
        initial,
      });

      this._teams.setHasMore(keys.length >= TEAMS_LIMIT);
      this._teams.setIsInitialLoad(true);
      this.metaTeams.setLoadedSuccessMeta();
    }
  };

  static normalizeProjects = (
    data: IProjectServer[]
  ): { keys: number[]; entities: Record<number, ProjectModel> } => {
    return normalizeModelsList<number, IProjectServer, ProjectModel>(
      data,
      ProjectModel
    );
  };

  static normalizeTeams = (
    data: ITeamServer[]
  ): { keys: number[]; entities: Record<number, TeamModel> } => {
    return normalizeModelsList<number, ITeamServer, TeamModel>(data, TeamModel);
  };

  destroy() {
    this._requests.loadProjectsList.destroy();
    this._requests.loadTeamsList.destroy();
  }
}

export default ProjectsStore;
