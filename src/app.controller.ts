import { Controller, Get, HttpCode, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Product as ProductInterface } from './graphql-schema';
import { Product as ProductClass, ProductFilter } from './graphql/graphql-schema';
import { Request } from 'express';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { SilentQuery } from './common/utils';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiResponse({ status: 200, description: 'App entry point'})
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('product')
  @ApiResponse({ status: 200, description: 'Get product by EAN'})
  @ApiQuery({ name: 'ean', type: typeof(String) })
  async getProduct(@Query('ean') ean: string): Promise<ProductInterface> {
    return await this.appService.getProduct(ean);
  }

  @Get('product/getAndCreate')
  @ApiResponse({ status: 200, description: 'Get product by URL'})
  @ApiResponse({ status: 201, description: 'Created non existing product'})
  @ApiQuery({ name: 'url', type: typeof(String) })
  async getProductByUrl(@Query('url') url: string): Promise<ProductInterface> {
    return await this.appService.getProductBy(url, null);
  }

  @Get('product/filter')
  @ApiResponse({ status: 200, description: 'Get products by FILTER'})
  @ApiQuery({ name: 'Filter', type: typeof(ProductFilter) })
  async getProductMatch(@Req() request: Request): Promise<ProductInterface[]> {
    return await this.appService.getProductMatch(request.query)
  }

  @Get('scrape/')
  @ApiQuery({ name: 'url', type: typeof(String) })
  async scrapeProducts(@Query('url') url: string) {
    return await this.appService.createOrUpdateProd(url)
  }
}
