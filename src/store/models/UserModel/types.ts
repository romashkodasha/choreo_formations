export interface ApiUser {
  id: number;
  username: string | null;
}

export interface User {
  id: number;
  username: string | null;
}

export type AuthData = {
  username: string;
  password: string;
  rememberMe: boolean;
};

export interface ApiAuth {
  user: ApiUser;
  token: string;
}

export enum AuthLocalStorageKey {
  accessToken = 'access_token',
}
