import { ScrapeJob } from '@domains/jobs';
import { LoggerService } from '@infrastructures/logging/logger.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { QueueName } from '@shared/common/enums';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QueueName.ScrapingQueue) private scrapingQueue: Queue<ScrapeJob>,
    private logger: LoggerService,
  ) {}

  async enqueueScrapeJobs(jobs: ScrapeJob[]) {
    this.logger.log('Enqueuing scrape jobs:', JSON.stringify(jobs));
    await this.scrapingQueue.addBulk(
      jobs.map((data) => ({
        name: 'scrape',
        // 10 days
        opts: {
          // deduplication here for preventing the extra work of a worker. no duplicate works can be done in 10 days => saving cpus time. I commented it out for loading testing
          // deduplication: { id: data.url, ttl: 1440000 * 10 },
        },
        data,
      })),
    );
  }
}

