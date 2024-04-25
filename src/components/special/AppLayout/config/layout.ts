import { RoutePath } from 'config/router';

export interface LayoutConfig {
  withHeader?: boolean;
}

export const LAYOUT_CONFIG: Record<RoutePath, LayoutConfig> = {
  [RoutePath.root]: {
    withHeader: true,
  },
  [RoutePath.error]: {
    withHeader: true,
  },
  [RoutePath.auth]: {
    withHeader: false,
  },
  [RoutePath.register]: {
    withHeader: false,
  },
  [RoutePath.project]: {
    withHeader: true,
  },
};
