import * as React from 'react';

import s from './PageWrapper.module.scss'

const PageWrapper: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className={s.page}>
      {children}
    </div>
  );
};

export default React.memo(PageWrapper);
