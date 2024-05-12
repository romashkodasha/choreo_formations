import { Modal, Typography } from 'antd';
import { MembersList } from 'components/common/MembersList';
import * as React from 'react';
import { useLocalStore } from 'store/hooks';
import { useRootStore } from 'store/globals/root';
import { TeamStore } from 'store/locals/TeamStore';
import { ScreenSpinner } from 'components/common';
import { observer } from 'mobx-react';

type TeamModalProps = {
  close: VoidFunction;
  isOpen: boolean;
  teamId: number;
};

const TeamModal: React.FC<TeamModalProps> = ({ isOpen, close, teamId }) => {
  const rootStore = useRootStore();
  const teamStore = useLocalStore(() => new TeamStore(rootStore));
  // const [title, setTitle] = React.useState('кек');
  // const [confirmLoading, setConfirmLoading] = React.useState(false);

  React.useEffect(() => {
    void teamStore.loadTeam({ id: teamId });
  }, [teamStore]);

  // const handleOk = () => {
  //   setConfirmLoading(true);
  //   setTimeout(() => {
  //     close();
  //     setConfirmLoading(false);
  //   }, 2000);
  // };

  return (
    <>
      <Modal
        title={
          teamStore.team && (
            <Typography.Title
              level={3}
              editable={{ tooltip: <>Редактировать</> }}
            >
              {teamStore.team?.name}
            </Typography.Title>
          )
        }
        open={isOpen}
        // onOk={handleOk}
        // confirmLoading={confirmLoading}
        onCancel={close}
      >
        {teamStore.meta.isLoading || !teamStore.team ? (
          <ScreenSpinner />
        ) : (
          <MembersList members={teamStore.team?.members} />
        )}
      </Modal>
    </>
  );
};

export default observer(TeamModal);
