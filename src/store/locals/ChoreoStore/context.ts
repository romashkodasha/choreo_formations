import { createContext } from 'react';

import ChoreoStore from './ChoreoStore';

const ChoreoContext = createContext<{
  store: ChoreoStore | null;
}>({
  store: null,
});

const ChoreoStoreProvider = ChoreoContext.Provider;

export { ChoreoContext, ChoreoStoreProvider };
