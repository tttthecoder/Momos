import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { ScrapeModule } from './scraping/scrape.module';

@Module({
  imports: [AuthenticationModule, ScrapeModule],
  controllers: [],
  exports: [],
  providers: [],
})
export class ControllerModule {}
