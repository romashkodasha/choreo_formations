import { createContext } from 'react';

import TeamStore from './TeamStore';

const TeamContext = createContext<{
  store: TeamStore | null;
}>({
  store: null,
});

const TeamStoreProvider = TeamContext.Provider;

export { TeamContext, TeamStoreProvider };
