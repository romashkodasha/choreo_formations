import type { ApiUser, User } from './types';

export const normalizeUser = (raw: ApiUser): User => ({
  id: raw.id,
  username: raw.username,
});

export const serializeUser = (user: User): ApiUser => ({
  id: user.id,
  username: user.username,
});
