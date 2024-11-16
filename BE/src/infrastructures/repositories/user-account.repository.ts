import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { AbstractRepository } from './abstract.repository';
import { UserAccountEntity } from '@infrastructures/entities/user-account.entity';
import { IUserAccountRepository } from '@domains/repositories/user-account-repository.interface';
import { AsyncLocalStorage } from 'async_hooks';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { UserAccount } from '@domains/entities';

@Injectable()
export class UserAccountRepository extends AbstractRepository<UserAccountEntity> implements IUserAccountRepository {
  constructor(
    @Inject('LocalStorage')
    private readonly localStorage: AsyncLocalStorage<any>,
    private readonly dataSource: DataSource,
  ) {
    super();
  }

  async createUserAccountWithLoginData(email: string, password: string): Promise<UserAccount> {
    let userAccount = new UserAccount();

    await this.userAccountEntityRepository.manager.transaction(async (transactionalEntityManager) => {
      const user = await this.findOneByEmail(email);

      if (!!user) {
        throw new BadRequestException('Email is already in use');
      }
      const userAccountEntity = await transactionalEntityManager.save(
        new UserAccountEntity({ email: email, passwordHash: password }),
      );
      userAccount = userAccountEntity.toModel();
    });

    return userAccount;
  }

  async findOneByUUID(uuid: string): Promise<UserAccount> {
    const entity = await this.userAccountEntityRepository.findOne({
      where: {
        uuid,
      },
      relations: {
        tokens: true,
      },
    });

    if (!entity) return null;

    return entity.toModel();
  }

  async findOneByEmail(email: string): Promise<UserAccount> {
    const entity = await this.userAccountEntityRepository.findOne({
      where: {
        email,
      },
      relations: {
        tokens: true,
      },
    });

    if (!entity) return null;

    return entity;
  }

  get userAccountEntityRepository(): Repository<UserAccountEntity> {
    const storage = this.localStorage.getStore();
    if (storage && storage.has('typeOrmEntityManager')) {
      return storage.get('typeOrmEntityManager').getRepository(UserAccountEntity);
    }
    return this.dataSource.getRepository(UserAccountEntity);
  }

  getEntityManager(): EntityManager {
    return this.userAccountEntityRepository.manager;
  }
}
