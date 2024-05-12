import * as React from 'react';

import ChoreoStore from './ChoreoStore';
import { ChoreoContext } from './context';

const useChoreoStore = (): ChoreoStore => {

  const choreoContext = React.useContext(ChoreoContext);

  return choreoContext.store!;
};

export * from './context';

export { ChoreoStore, useChoreoStore };
