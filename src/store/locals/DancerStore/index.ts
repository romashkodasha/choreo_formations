import * as React from 'react';

import DancerStore from './DancerStore';
import { DancerContext } from './context';

const useDancerStore = (): DancerStore => {

  const dancerContext = React.useContext(DancerContext);

  return dancerContext.store!;
};

export * from './context';

export { DancerStore, useDancerStore };
