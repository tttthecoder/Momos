import { UseCase } from '@domains/usecase/usecase.interface';
import { QueueService } from '@infrastructures/services/bull-queue/queue.service';
import { SuccessResponseDto } from '@shared/dtos';

export class QueueURLsUseCase implements UseCase<{ urls: string[] }, SuccessResponseDto> {
  constructor(private readonly queueService: QueueService) {}

  // At first i thought about validating an array of urls => draining too much CPUs => i changed the structure of the dto but do not
  // have time to change the execute() function and all the logic behind => keep as is is good enough
  async execute(input: { urls: string[] }): Promise<SuccessResponseDto> {
    try {
      await this.queueService.enqueueScrapeJobs(input.urls.map((url) => ({ url })));
      return { result: true };
    } catch (error) {
      return { result: false };
    }
  }
}
