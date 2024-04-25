import { observer } from 'mobx-react';
import * as React from 'react';
import { useNavigate } from 'react-router';

import { RoutePath } from 'config/router';

// TODO: кастомизировать стили
import s from './ErrorFallback.module.scss';
import { useRootStore } from 'store/globals/root';
import { Button } from 'antd';

const ErrorFallback: React.FC = () => {
  const navigate = useNavigate();
  const { reload } = useRootStore();

  const restart = React.useCallback(() => {
    navigate(RoutePath.root, { replace: true });
    reload();
  }, [navigate, reload]);

  return (
    <section className={s['error-page']}>
      <h2 className={s.title}>Произошла ошибка!</h2>
      <div className={s.text}>Перезагрузите сайт или попробуйте позже</div>
      <Button onClick={restart}>Перезагрузить</Button>
    </section>
  );
};

export default observer(ErrorFallback);
