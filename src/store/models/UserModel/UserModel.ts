import { ApiUser, User } from './types';
import { normalizeUser, serializeUser } from './utils';

export class UserModel {
  id: number;
  username: string | null;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
  }

  static fromJson(raw: ApiUser): UserModel {
    return new UserModel(normalizeUser(raw));
  }

  static toJson(user: UserModel): ApiUser {
    return serializeUser(user);
  }
}
