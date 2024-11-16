import { EnvironmentConfigModule } from '@infrastructures/config/environment-config/environment-config.module';
import { UsecasesProxyProvide } from '@infrastructures/enums';
import { LoggerModule } from '@infrastructures/logging/logger.module';
import {
  GenerateAccessTokenFromRefreshTokenProvider,
  LoginProvider,
  LogoutProvider,
  RegisterProvider,
} from '@infrastructures/providers/authentication';
import { GetManyMediasProvider } from '@infrastructures/providers/scrape/get-medias.provider';
import { QueueUrlsProvider } from '@infrastructures/providers/scrape/queue-urls.provider';
import { RepositoriesModule } from '@infrastructures/repositories/repositories.module';
import { QueueModule } from '@infrastructures/services/bull-queue/queue.module';
import { UnitOfWorkModule } from '@infrastructures/unit-of-work/unit-of-work.module';
import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [LoggerModule, JwtModule, EnvironmentConfigModule, RepositoriesModule, UnitOfWorkModule, QueueModule],
})
@Global()
export class UsecasesProxyModule {
  static register(): DynamicModule {
    return {
      global: true,
      module: UsecasesProxyModule,
      providers: [
        // authentication
        LoginProvider,
        RegisterProvider,
        LogoutProvider,
        GenerateAccessTokenFromRefreshTokenProvider,

        // scraping
        QueueUrlsProvider,
        GetManyMediasProvider,
      ],
      exports: [
        // authentication
        UsecasesProxyProvide.LoginUsecase,
        UsecasesProxyProvide.RegisterUseCase,
        UsecasesProxyProvide.LogoutUsecase,
        UsecasesProxyProvide.GenerateAccessTokenFromRefreshTokenUseCase,
        // scraping
        UsecasesProxyProvide.QueueURLs,
        UsecasesProxyProvide.GetManyMedias,
      ],
    };
  }
}
