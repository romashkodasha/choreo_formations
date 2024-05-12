import { ProjectCard, ScreenSpinner } from 'components/common';
import * as React from 'react';
import s from './ProjectsList.module.scss';
import { observer } from 'mobx-react';
import { useRootStore } from 'store/globals/root';
import { useLocalStore, useRouterStore } from 'store/hooks';
import { ProjectsStore } from 'store/locals/ProjectsStore';
import { FloatButton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const ProjectsList: React.FC = () => {
  const rootStore = useRootStore();
  const projectsStore = useLocalStore(() => new ProjectsStore(rootStore));

  React.useEffect(() => {
    const init = async () => {
      await projectsStore.loadProjectsList({ initial: true });
    };

    void init();
  }, [projectsStore]);

  if (projectsStore.meta.isLoading) {
    return <ScreenSpinner />;
  }
  return (
    <>
      <div className={s.list}>
        {projectsStore.projects.map((project) => (
          <ProjectCard project={project} className={s.card} key={project.id} />
        ))}
      </div>
      <FloatButton
        icon={<PlusOutlined />}
        tooltip={<div>Создать новый проект</div>}
      />
    </>
  );
};

export default observer(ProjectsList);
