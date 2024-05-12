import * as React from 'react';

import TeamStore from './TeamStore';
import { TeamContext } from './context';

const useTeamStore = (): TeamStore => {
  const teamContext = React.useContext(TeamContext);

  return teamContext.store!;
};

export * from './context';

export { TeamStore, useTeamStore };
