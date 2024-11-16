import { Module } from '@nestjs/common/decorators';
import { ScrapeController } from './scrape.controler';

@Module({
  controllers: [ScrapeController],
})
export class ScrapeModule {}

