import * as React from 'react';

import s from './PageWrapper.module.scss'
import { Snackbar } from 'components/common';
import { useRootStore } from 'store/globals/root';
import { observer } from 'mobx-react';

const PageWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  const store = useRootStore();
  
  return (
    <div className={s.page}>
      {children}
      <Snackbar isVisible={store.snackbarStore.isSnackbarOpen} />
    </div>
  );
};

export default observer(PageWrapper);
