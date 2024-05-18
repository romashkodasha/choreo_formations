import * as React from 'react';

import s from './MembersList.module.scss';
import { MemberModel } from 'store/models/MemberModel';

import cn from 'classnames';
import { Avatar } from 'antd';

type MembersListProps = {
  members?: MemberModel[];
  className?: string;
  style?: React.CSSProperties;
};

const MembersList: React.FC<MembersListProps> = ({ members, className, style }) => {
  return (
    <div className={cn(s.list, className)} style={style}>
      {members?.map((member) => (
        <div className={s.member} key={member.id}>
          <Avatar className={s.avatar} style={{backgroundColor: `#${member.color}`}}/>
          {member.name}
        </div>
      ))}
    </div>
  );
};

export default React.memo(MembersList);
