
import { useRootStore } from 'store/globals/root';
import { type RouterStore } from 'store/globals/router';
import { type UserStore } from 'store/globals/user/UserStore';
import { type UIStore } from 'store/globals/ui';

export function useRouterStore(): RouterStore {
  return useRootStore().routerStore;
}

export function useUIStore(): UIStore {
  return useRootStore().uiStore;
}

export function useUserStore(): UserStore {
  return useRootStore().userStore;
}
