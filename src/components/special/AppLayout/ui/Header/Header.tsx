import * as React from 'react';

import s from './Header.module.scss';
import { Logo, ThemeEnum } from 'components/common';
import { useUserStore } from 'store/hooks';
import { Button, Popover } from 'antd';
import { observer } from 'mobx-react';
import { UserOutlined } from '@ant-design/icons';

const Header: React.FC = () => {
  const userStore = useUserStore();
  return (
    <div className={s.header}>
      <Logo size="m" theme={ThemeEnum.white} />
      <div>
        <Popover content={<div>{userStore.user?.name}</div>} title="Имя пользователя:" trigger="focus" arrow={false} placement='bottomLeft'>
          <Button shape="circle" className={s.username} icon={<UserOutlined />} />
        </Popover>
        <Button onClick={userStore.logout}>Выйти</Button>
      </div>
    </div>
  );
};

export default observer(Header);
