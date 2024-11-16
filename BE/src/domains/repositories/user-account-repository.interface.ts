import { UserAccount } from '@domains/entities';

export interface IUserAccountRepository {
  getEntityManager(): unknown;

  findOneByEmail(email: string): Promise<UserAccount | null>;

  findOneByUUID(uuid: string): Promise<UserAccount | null>;

  createUserAccountWithLoginData(email: string, password: string): Promise<UserAccount>;
}
