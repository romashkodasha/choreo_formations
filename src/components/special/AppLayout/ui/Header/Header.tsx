import * as React from 'react';

import s from './Header.module.scss';
import { Logo, ThemeEnum } from 'components/common';
import { useUserStore } from 'store/hooks';
import { Avatar, Button } from 'antd';
import { observer } from 'mobx-react';
import { toJS } from 'mobx';

const Header: React.FC = () => {
  const userStore = useUserStore();
  console.log(toJS(userStore.user?.name))
  return (
    <div className={s.header}>
      <Logo size="m" theme={ThemeEnum.white} />
      <Avatar>{userStore.user?.name}</Avatar>
      <Button />
    </div>
  );
};

export default observer(Header);
