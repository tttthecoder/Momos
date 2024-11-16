import { TypeOrmConfigModule } from '@infrastructures/config/typeorm/typeorm.module';
import { Module } from '@nestjs/common';
import { UserAccountRepository } from './user-account.repository';
import { UserTokenRepository } from './user-token.repository';
import { MediaEntityRepository } from './media.repository';

@Module({
  imports: [TypeOrmConfigModule],
  providers: [UserAccountRepository, UserTokenRepository, MediaEntityRepository],
  exports: [UserAccountRepository, UserTokenRepository, MediaEntityRepository],
})
export class RepositoriesModule {}
