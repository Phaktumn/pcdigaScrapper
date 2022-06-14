import { Controller, Get, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Product } from './graphql-schema';
import { ProductFilter } from './graphql/graphql-schema';
import { Request } from 'express';

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

  @Get('product/getAndCreate')
  async getProductByUrl(@Query('url') url: string): Promise<Product> {
    return await this.appService.getProductBy(url, null);
  }

  @Get('product/filter')
  async getProductMatch(@Req() request: Request): Promise<Product[]> {
    return await this.appService.getProductMatch(request.query)
  }
}
