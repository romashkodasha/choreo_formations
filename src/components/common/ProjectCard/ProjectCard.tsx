import * as React from 'react';
import { ProjectModel } from 'store/models/ProjectModel';
import { Typography } from 'antd';
import { DownOutlined, RightOutlined } from '@ant-design/icons';
import { MembersList } from '../MembersList';
import cn from 'classnames';

import s from './ProjectCard.module.scss';

type ProjectCardProps = {
  project: ProjectModel;
  className?: string;
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, className }) => {
  const [showMembersList, setShowMembersList] = React.useState(false);

  const onMouseEnterHandler = () => {
    setShowMembersList(true);
  };

  const onMouseLeaveHandler = () => {
    setShowMembersList(false);
  };
  return (
    <div className={cn(s.card, className)}>
      <Typography.Title level={3}>{project.name}</Typography.Title>
      <Typography.Text>
        Cцена: {project.width} x {project.height}{' '}
      </Typography.Text>
      <Typography.Text
        onMouseEnter={onMouseEnterHandler}
        onMouseLeave={onMouseLeaveHandler}
      >
        Команда: {project.team.name} {showMembersList ? <DownOutlined /> : <RightOutlined />}
      </Typography.Text>
      <MembersList
        members={project.team.members.items}
        className={s.list}
        style={{
          opacity: showMembersList ? 1 : 0,
          pointerEvents: showMembersList ? 'auto' : 'none',
        }}
      />
    </div>
  );
};

export default React.memo(ProjectCard);
