import { RouterProvider } from 'react-router-dom';
import { RootStoreProvider } from './store/globals/root';
import { ROUTER } from './config/router';
import { ScreenSpinner } from './components/common';
import * as React from 'react';

function App() {
  return (
    <RootStoreProvider>
      <RouterProvider router={ROUTER} fallbackElement={<ScreenSpinner />}/>
    </RootStoreProvider>
  );
}

export default App;
