
import { useRootStore } from 'store/globals/root';
import { type RouterStore } from 'store/globals/router';
import { type UserStore } from 'store/globals/user/UserStore';


export function useRouterStore(): RouterStore {
  return useRootStore().routerStore;
}

export function useUserStore(): UserStore {
  return useRootStore().userStore;
}
