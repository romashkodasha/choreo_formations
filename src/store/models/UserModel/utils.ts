import type { ApiUser, User } from './types';

export const normalizeUser = (raw: ApiUser): User => ({
  id: raw.id,
  name: raw.name,
  email: raw.email,
});

export const serializeUser = (user: User): ApiUser => ({
  id: user.id,
  name: user.name,
  email: user.email,
});
