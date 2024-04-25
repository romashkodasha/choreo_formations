import * as React from 'react';

import ChoreoStore from './ChoreoStore';

const ChoreoStoreContext = React.createContext<ChoreoStore | null>(null);

export const ChoreoStoreProvider = ChoreoStoreContext.Provider;

export const useChoreoStore = () => {
  const context = React.useContext(ChoreoStoreContext);

  if (!context) {
    throw new Error('ChoreoStoreContext is not found');
  }

  return context;
};
