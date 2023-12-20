import { useLocalObservable } from 'mobx-react';
import * as React from 'react';

import { ILocalStore } from 'shared/interfaces/ILocalStore';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useLocalStore = <S extends ILocalStore = any>(initializer: () => S): S => {
  const store = useLocalObservable(initializer);

  React.useEffect(() => {
    return () => {
      store?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return store;
};
