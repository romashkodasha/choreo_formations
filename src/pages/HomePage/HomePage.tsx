import { observer, useLocalStore } from 'mobx-react';
import * as React from 'react';
import {
  ProjectsStore,
  ProjectsStoreProvider,
} from 'store/locals/ProjectsStore';
import { useRootStore } from 'store/globals/root';
import { Segmented } from 'antd';
import { OPTIONS, OptionsEnum } from 'config/options';
import { ProjectsList } from './ProjectsList';
import { TeamsList } from './TeamsList';

import s from './HomePage.module.scss';

const HomePage: React.FC = () => {
  const [filter, setFilter] = React.useState(OptionsEnum.projects);

  const onChange = (value: string) => {
    setFilter(value);
  };

  return (
    <>
      <Segmented
        options={OPTIONS}
        size="large"
        block
        value={filter}
        onChange={onChange}
        className={s.filter}
      />
      {filter === OptionsEnum.projects && <ProjectsList />}
      {filter === OptionsEnum.teams && <TeamsList />}
    </>
  );
};

export default observer(HomePage);
