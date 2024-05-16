import { ApiUser, User } from './types';
import { normalizeUser, serializeUser } from './utils';

export class UserModel {
  id: number;
  name: string;
  email: string;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
  }

  static fromJson(raw: ApiUser): UserModel {
    return new UserModel(normalizeUser(raw));
  }

  static toJson(user: UserModel): ApiUser {
    return serializeUser(user);
  }
}
