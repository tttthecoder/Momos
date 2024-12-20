import { UserTokenType } from '@domains/common/token';
import { UserToken } from '@domains/entities';

export interface IUserTokenRepository {
  getEntityManager(): any;

  create(dto: Pick<UserToken, 'token' | 'type' | 'userAccountId' | 'expiredAt'>): Promise<UserToken | null>;

  creates(dtos: Pick<UserToken, 'token' | 'type' | 'userAccountId' | 'expiredAt'>[]): Promise<UserToken[] | null>;

  getUserTokenListByUserAccountId(id: number, type?: UserTokenType): Promise<UserToken[]>;

  updateUserToken(model: UserToken): Promise<boolean>;
}
