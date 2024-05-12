import * as React from 'react';

import TeamsStore from './TeamsStore';
import { TeamsContext } from './context';

const useTeamsStore = (): TeamsStore => {

  const teamsContext = React.useContext(TeamsContext);

  return teamsContext.store!;
};

export * from './context';

export { TeamsStore, useTeamsStore };
