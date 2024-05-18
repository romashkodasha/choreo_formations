import { ScreenSpinner, TeamCard } from 'components/common';
import { observer } from 'mobx-react';
import * as React from 'react';
import { TeamsStore } from 'store/locals/TeamsStore';

import s from './TeamsList.module.scss';
import { useRootStore } from 'store/globals/root';
import { useLocalStore } from 'store/hooks';
import { Button, FloatButton, Typography } from 'antd';
import { PlusOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { CreateTeamModal } from 'components/modals/';

const TeamsList: React.FC = () => {
  const rootStore = useRootStore();
  const teamsStore = useLocalStore(() => new TeamsStore(rootStore));
  const [isModalOpen, setModalOpen] = React.useState(false);

  React.useEffect(() => {
    const init = async () => {
      await teamsStore.loadTeamsList({ initial: true });
    };

    void init();
  }, [teamsStore, isModalOpen]);

  const handleClose = React.useCallback(() => {
    setModalOpen(false);
  }, []);

  const handleOpen = React.useCallback(() => {
    setModalOpen(true);
  }, []);

  if (teamsStore.meta.isLoading) {
    return <ScreenSpinner />;
  }

  return (
    <>
      {teamsStore.teams.length === 0 ? (
        <div className={s.empty}>
          <Button icon={<UsergroupAddOutlined />} shape="circle" onClick={handleOpen} />
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
            onClick={handleOpen}
          />
        </>
      )}
      <CreateTeamModal close={handleClose} isOpen={isModalOpen} />
    </>
  );
};
export default observer(TeamsList);
