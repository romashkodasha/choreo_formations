import * as React from 'react';

export const initStoreContext = <T>(
  storeCreator: () => T
): {
  StoreContext: React.Context<T>;
  StoreProvider: React.FC<React.PropsWithChildren>;
  useStoreContext: () => T;
} => {
  const store = storeCreator();

  const StoreContext = React.createContext(store);

  const StoreProvider: React.FC<React.PropsWithChildren> = ({ children }) =>
    React.createElement(StoreContext.Provider, { value: store }, children);

  const useStoreContext = (): T => {
    return React.useContext(StoreContext);
  };

  return {
    StoreContext,
    StoreProvider,
    useStoreContext,
  };
};
