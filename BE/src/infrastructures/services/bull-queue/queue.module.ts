import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { BullModule } from '@nestjs/bullmq';
import { EnvironmentConfigModule } from '@infrastructures/config/environment-config/environment-config.module';
import { EnvironmentConfigService } from '@infrastructures/config/environment-config/environment-config.service';
import { QueueName } from '@shared/common/enums';
import { LoggerModule } from '@infrastructures/logging/logger.module';
import { join } from 'path';

@Module({
  imports: [
    LoggerModule,
    BullModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: (config: EnvironmentConfigService) => {
        {
          return { connection: { host: config.getRedisHost(), port: config.getRedisPort() } };
        }
      },
    }),
    BullModule.registerQueue({
      name: QueueName.ScrapingQueue,
      // optimize for 1 cpu, use concurrency of 1, because 2 or more would create 2 or more processes => take more cpus time from main event loop
      processors: [{ concurrency: 1, path: join(__dirname, '../../processor/scrape/scrape.processor.js') }],
      defaultJobOptions: {
        // Retry on failure => BullMQ is nice with this support!
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    }),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}

