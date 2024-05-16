export interface ApiUser {
  id: number;
  name: string;
  email: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export type AuthData = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  password: string;
  email: string;
}

export interface ApiAuth {
  user: ApiUser;
  token: string;
  detail?: string;
}


export enum AuthLocalStorageKey {
  accessToken = 'accessToken',
  refreshToken = 'refreshToken'
}
