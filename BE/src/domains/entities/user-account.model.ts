import { UserToken } from './user-token.model';
export class UserAccount {
  constructor(data?: Partial<UserAccount>) {
    Object.assign(this, { ...data });
  }
  id: number;
  uuid: string;
  passwordHash: string;
  email: string;
  tokens: UserToken[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  // more properties can be added later
}
