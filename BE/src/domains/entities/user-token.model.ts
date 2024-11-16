import { UserTokenType } from '@domains/common/token';
import { UserAccount } from './user-account.model';

export class UserToken {
  id: number;
  userAccountId: number;
  type: UserTokenType;
  token: string;
  expiredAt: Date;
  user: UserAccount;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
