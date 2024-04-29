import * as React from 'react';

import ProjectsStore from './ProjectsStore';
import { ProjectsContext } from './context';

const useProjectsStore = (): ProjectsStore => {
  const projectsContext = React.useContext(ProjectsContext);

  return projectsContext.store!;
};

export * from './context';

export { ProjectsStore, useProjectsStore };
