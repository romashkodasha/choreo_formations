import { createContext } from 'react';

import TeamsStore from './TeamsStore';

const TeamsContext = createContext<{
  store: TeamsStore | null;
}>({
  store: null,
});

const TeamsStoreProvider = TeamsContext.Provider;

export { TeamsContext, TeamsStoreProvider };
