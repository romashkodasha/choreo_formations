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

const PROJECTS_LIMIT = 10;

class ProjectsStore implements ILocalStore {
  private readonly _rootStore: RootStoreType;
  private readonly _projects = new ListModel<ProjectModel, 'id'>();
  readonly meta = new MetaModel();

  private readonly _requests: {
    loadProjectsList: ApiRequest<{ projects: IProjectServer[] }, ErrorResponse>;
  };

  constructor(rootStore: RootStoreType) {
    this._rootStore = rootStore;

    this._requests = {
      loadProjectsList: this._rootStore.apiStore.createRequest({
        url: ENDPOINTS.projects.url,
        method: ENDPOINTS.projects.method,
      }),
    };

    makeObservable<ProjectsStore>(this, {
      projects: computed,
    });
  }

  get projects() {
    return this._projects.items;
  }

  get isLoaded(): boolean {
    return this._requests.loadProjectsList.isLoaded;
  }

  get isLoading(): boolean {
    return this._requests.loadProjectsList.isLoading;
  }

  loadProjectsList = async ({
    initial = false,
  }: LoadInitialType): Promise<void> => {
    if (this.meta.isLoading) {
      return;
    }

    this.meta.setLoadedStartMeta();

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
      this.meta.setLoadedErrorMeta();

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

      this._projects.setHasMore(keys.length >= PROJECTS_LIMIT);
      this._projects.setIsInitialLoad(true);
      this.meta.setLoadedSuccessMeta();
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

  destroy() {
    this._requests.loadProjectsList.destroy();
  }
}

export default ProjectsStore;
