import { Module } from '@nestjs/common';
import { NestCrawlerModule } from 'nest-crawler';
import { GlobalDataScraperService } from './globadata-scrapper.service';
import { ScraperService } from './scraper.service';

@Module({
  providers: [ScraperService, GlobalDataScraperService],
  imports: [NestCrawlerModule],
  exports: [ScraperService, GlobalDataScraperService],
})
export class ScraperModule {}
