import { observer, useLocalStore } from 'mobx-react';
import * as React from 'react';
import {
  ProjectsStore,
  ProjectsStoreProvider,
} from 'store/locals/ProjectsStore';
import { useRootStore } from 'store/globals/root';
import { Loader } from 'components/special/AppLayout/ui';
import { Segmented } from 'antd';
import { OPTIONS, OptionsEnum } from 'config/options';
import { ProjectsList } from './ProjectsList';
import { TeamsList } from './TeamsList';

import s from './HomePage.module.scss';

const HomePage: React.FC = () => {
  const rootStore = useRootStore();
  const projectsStore = useLocalStore(() => new ProjectsStore(rootStore));



  const onChange = React.useCallback(
    (value: string) => {
      projectsStore.filter.changeValue(value);
    },
    [projectsStore]
  );

  return (
    <ProjectsStoreProvider
      value={{
        store: projectsStore,
      }}
    >
      <Segmented
        options={OPTIONS}
        size="large"
        block
        value={projectsStore.filter.value}
        onChange={onChange}
        className={s.filter}
      />
      {projectsStore.filter.value === OptionsEnum.projects && (
        <ProjectsList />
      )}
      {projectsStore.filter.value === OptionsEnum.teams && <TeamsList />}
    </ProjectsStoreProvider>
  );
};

export default observer(HomePage);
