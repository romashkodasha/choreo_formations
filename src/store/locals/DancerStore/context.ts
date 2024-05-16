import { createContext } from 'react';

import DancerStore from './DancerStore';

const DancerContext = createContext<{
  store: DancerStore | null;
}>({
  store: null,
});

const DancerStoreProvider = DancerContext.Provider;

export { DancerContext, DancerStoreProvider };
