import { ScreenSpinner, TeamCard } from 'components/common';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TeamsStore, TeamsStoreProvider } from 'store/locals/TeamsStore';

import s from './TeamsList.module.scss';
import { useRootStore } from 'store/globals/root';
import { useLocalStore, useUIStore } from 'store/hooks';
import { Button, FloatButton, Typography } from 'antd';
import { PlusOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { TeamModal } from 'components/modals/';

const TeamsList: React.FC = () => {
  const rootStore = useRootStore();
  const teamsStore = useLocalStore(() => new TeamsStore(rootStore));
  const {teamCreateModal} = useUIStore();

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
    <TeamsStoreProvider value={{ store: teamsStore }}>
      {teamsStore.teams.length === 0 ? (
        <div className={s.empty}>
          <Button icon={<UsergroupAddOutlined />} shape="circle" onClick={teamCreateModal.open} />
          <Typography.Title level={3}>Пока нет команд</Typography.Title>
        </div>
      ) : (
        <>
          <div className={s.list}>
            {teamsStore.teams.map((team) => (
              <TeamCard team={team} className={s.card} key={team.id} />
            ))}
          </div>

          <FloatButton
            icon={<PlusOutlined />}
            tooltip={<div>Создать новую команду</div>}
            onClick={teamCreateModal.open}
          />
        </>
      )}
      <TeamModal close={teamCreateModal.close} isOpen={teamCreateModal.isOpen} />
    </TeamsStoreProvider>
  );
};
export default observer(TeamsList);
