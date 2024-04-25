import * as React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import { ScreenSpinner } from 'components/common';

import { RoutePath } from './paths';
import { ErrorFallback, AppLayout } from 'components/special';

const AuthPage = React.lazy(() =>
  // todo: при необходимости добавить загрузку изображений
  Promise.all([import('pages/AuthPage/AuthPage')]).then(
    ([moduleExports]) => moduleExports
  )
);

const RegisterPage = React.lazy(() =>
  // todo: при необходимости добавить загрузку изображений
  Promise.all([import('pages/RegisterPage/RegisterPage')]).then(
    ([moduleExports]) => moduleExports
  )
);

const ProjectPage = React.lazy(() =>
  // todo: при необходимости добавить загрузку изображений
  Promise.all([import('pages/ProjectPage/ProjectPage')]).then(
    ([moduleExports]) => moduleExports
  )
);

const HomePage = React.lazy(() =>
  // todo: при необходимости добавить загрузку изображений
  Promise.all([import('pages/HomePage/HomePage')]).then(
    ([moduleExports]) => moduleExports
  )
);

const withScreenSpinner = (Component: React.ComponentType) => (
  <React.Suspense fallback={<ScreenSpinner />}>
    <Component />
  </React.Suspense>
);

export const ROUTER = createBrowserRouter([
  {
    path: RoutePath.root,
    element: <AppLayout />,
    errorElement: <ErrorFallback />,
    children: [
      {
        children: [
          {
            index: false,
          },
          {
            path: RoutePath.auth,
            element: withScreenSpinner(AuthPage),
          },
          {
            path: RoutePath.register,
            element: withScreenSpinner(RegisterPage),
          },
          {
            path: RoutePath.project,
            element: withScreenSpinner(ProjectPage),
          },
          {path: RoutePath.root,
            element: withScreenSpinner(HomePage),
          }
        ],
      },
    ],
  },
]);
