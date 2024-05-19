import * as React from 'react';
import { TeamModel } from 'store/models/TeamModel';

import s from './TeamCard.module.scss';
import { Avatar, Typography } from 'antd';
import pluralize from 'utils/pluralize';
import cn from 'classnames';
import { RightOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react';
import { TeamModal } from 'components/modals';

type TeamCardProps = {
  team: TeamModel;
  className?: string;
};
const TeamCard: React.FC<TeamCardProps> = ({ team, className }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const open = () => {
    setIsOpen(true);
  }

  const close = () => {
    setIsOpen(false);
  }

  return (
    <>
      <div className={cn(s.card, className)} onClick={open}>
        <Avatar className={s.avatar} />
        <div className={s.content}>
          <Typography.Title level={3}>{team.name}</Typography.Title>
          <Typography.Text>
            {pluralize(team.members.length, {
              one: 'танцор',
              two: 'танцора',
              five: 'танцоров',
            })}
          </Typography.Text>
        </div>
        <RightOutlined className={s.arrow} />
      </div>
      <TeamModal isOpen={isOpen} close={close} team={team} />
    </>
  );
};

export default observer(TeamCard);
