import { QueueURLsUseCase } from '@applications/usecase/scrape';
import { UsecasesProxyProvide } from '@infrastructures/enums';
import { QueueService } from '@infrastructures/services/bull-queue/queue.service';
import { UseCaseProxy } from '@infrastructures/usecase-proxy/usecases-proxy';

export const QueueUrlsProvider = {
  inject: [QueueService],
  provide: UsecasesProxyProvide.QueueURLs,
  useFactory: (queueService: QueueService) => new UseCaseProxy(new QueueURLsUseCase(queueService)),
};

