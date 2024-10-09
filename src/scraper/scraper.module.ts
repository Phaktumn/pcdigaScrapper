import { Module } from '@nestjs/common';
import { NestCrawlerModule } from 'nest-crawler';
import { GlobalDataScraperService } from './globadata-scrapper.service';
import { ScraperService } from './scraper.service';
import { VodafoneIphone16DataScraperService } from './vodafone-scrapper.service';

@Module({
  providers: [ScraperService, GlobalDataScraperService, VodafoneIphone16DataScraperService],
  imports: [NestCrawlerModule],
  exports: [ScraperService, GlobalDataScraperService, VodafoneIphone16DataScraperService],
})
export class ScraperModule {}
