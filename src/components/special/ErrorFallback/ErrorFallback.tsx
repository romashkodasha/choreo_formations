import { observer } from 'mobx-react';
import * as React from 'react';
import { useNavigate } from 'react-router';

import { RoutePath } from 'config/router';

// TODO: кастомизировать стили
import s from './ErrorFallback.module.scss';
import { useRootStore } from 'store/globals/root';
import { Button, Typography } from 'antd';

const ErrorFallback: React.FC = () => {
  const navigate = useNavigate();
  const { reload } = useRootStore();

  const restart = React.useCallback(() => {
    navigate(RoutePath.root, { replace: true });
    reload();
  }, [navigate, reload]);

  return (
    <section className={s['error-page']}>
      <Typography.Title level={1}>Произошла ошибка!</Typography.Title>
      <Typography.Title level={2}>
        Перезагрузите сайт или попробуйте позже
      </Typography.Title>
      <Button onClick={restart}>Перезагрузить</Button>
    </section>
  );
};

export default observer(ErrorFallback);
