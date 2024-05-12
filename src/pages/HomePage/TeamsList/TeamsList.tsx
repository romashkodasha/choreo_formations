import { ScreenSpinner, TeamCard } from 'components/common';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TeamsStore } from 'store/locals/TeamsStore';

import s from './TeamsList.module.scss';
import { useRootStore } from 'store/globals/root';
import { useLocalStore } from 'store/hooks';
import { FloatButton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const TeamsList: React.FC = () => {
  const rootStore = useRootStore();
  const teamsStore = useLocalStore(() => new TeamsStore(rootStore));

  React.useEffect(() => {
    const init = async () => {
      await teamsStore.loadTeamsList({ initial: true });
    };

    void init();
  }, [teamsStore]);

  if (teamsStore.meta.isLoading) {
    return <ScreenSpinner />;
  }

  return (
    <>
      <div className={s.list}>
        {teamsStore.teams.map((team) => (
          <TeamCard team={team} className={s.card} key={team.id} />
        ))}
      </div>
      <FloatButton icon={<PlusOutlined />} tooltip={<div>Создать новую команду</div>} />
    </>
  );
};
export default observer(TeamsList);
