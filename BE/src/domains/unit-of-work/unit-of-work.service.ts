import { IMediaRepository } from '@domains/repositories/media.repository.interface';
import { IUserAccountRepository } from '@domains/repositories/user-account-repository.interface';
import { IUserTokenRepository } from '@domains/repositories/user-token-repository.interface';

export interface IUnitOfWork {
  getTransactionManager(): unknown;

  // Repository
  getUserAccountRepository(): IUserAccountRepository;
  getUserTokenRepository(): IUserTokenRepository;
  getMediaRepository(): IMediaRepository;
}
