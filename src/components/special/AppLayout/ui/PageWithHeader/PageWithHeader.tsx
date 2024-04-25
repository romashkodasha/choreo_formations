import { Header, PageWrapper } from '..';
import * as React from 'react';

const PageWithHeader: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <PageWrapper>
      <Header />
      {children}
    </PageWrapper>
  );
};

export default React.memo(PageWithHeader);
