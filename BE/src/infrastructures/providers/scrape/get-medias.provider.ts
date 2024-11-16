import { GetManyMediasUseCase } from '@applications/usecase/scrape/getManyMedias.usecase';
import { UsecasesProxyProvide } from '@infrastructures/enums';
import { UnitOfWork } from '@infrastructures/unit-of-work/unit-of-work.service';
import { UseCaseProxy } from '@infrastructures/usecase-proxy/usecases-proxy';

export const GetManyMediasProvider = {
  inject: [UnitOfWork],
  provide: UsecasesProxyProvide.GetManyMedias,
  useFactory: (uow: UnitOfWork) => new UseCaseProxy(new GetManyMediasUseCase(uow)),
};

