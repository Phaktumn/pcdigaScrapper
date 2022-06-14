import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { Product } from './graphql-schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('product')
  async getProduct(@Query('ean') ean: string): Promise<Product> {
    return await this.appService.getProduct(ean);
  }
}
