import { IMediaRepository } from '@domains/repositories/media.repository.interface';
import { IUserAccountRepository } from '@domains/repositories/user-account-repository.interface';
import { IUserTokenRepository } from '@domains/repositories/user-token-repository.interface';
import { IUnitOfWork } from '@domains/unit-of-work/unit-of-work.service';
import { MediaEntityRepository } from '@infrastructures/repositories/media.repository';
import { UserAccountRepository } from '@infrastructures/repositories/user-account.repository';
import { UserTokenRepository } from '@infrastructures/repositories/user-token.repository';
import { Inject } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { DataSource } from 'typeorm';

export class UnitOfWork implements IUnitOfWork {
  constructor(
    private readonly dataSource: DataSource,
    @Inject('LocalStorage')
    private readonly _asyncLocalStorage: AsyncLocalStorage<any>,
    @Inject(UserAccountRepository)
    private readonly userAccountRepository: IUserAccountRepository,
    @Inject(UserTokenRepository)
    private readonly userTokenRepository: IUserTokenRepository,
    @Inject(MediaEntityRepository)
    private readonly mediaRepository: IMediaRepository,
  ) {}
  getUserTokenRepository(): IUserTokenRepository {
    return this.userTokenRepository;
  }
  getUserAccountRepository(): IUserAccountRepository {
    return this.userAccountRepository;
  }

  getMediaRepository(): IMediaRepository {
    return this.mediaRepository;
  }

  getTransactionManager(): unknown {
    const storage = this._asyncLocalStorage.getStore();
    if (storage && storage.has('typeOrmEntityManager')) {
      return storage.get('typeOrmEntityManager');
    }
    return null;
  }
}
