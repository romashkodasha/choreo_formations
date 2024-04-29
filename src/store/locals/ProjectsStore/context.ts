import { createContext } from 'react';

import ProjectsStore from './ProjectsStore';

const ProjectsContext = createContext<{
  store: ProjectsStore | null;
}>({
  store: null,
});

const ProjectsStoreProvider = ProjectsContext.Provider;

export { ProjectsContext, ProjectsStoreProvider };
