import { ProjectCard, ScreenSpinner } from 'components/common';
import * as React from 'react';
import { useProjectsStore } from 'store/locals/ProjectsStore';

import s from './ProjectsList.module.scss';
import { observer } from 'mobx-react';

const ProjectsList: React.FC = () => {
  const projectsStore = useProjectsStore();

  React.useEffect(() => {
    const init = async () => {
      await projectsStore.loadProjectsList({ initial: true });
    };

    void init();
  }, [projectsStore]);

  if (projectsStore.metaProjects.isLoading) {
    return <ScreenSpinner />;
  }
  return (
    <div className={s.list}>
      {projectsStore.projects.map((project) => (
        <ProjectCard project={project} className={s.card} />
      ))}
    </div>
  );
};

export default observer(ProjectsList);
