import { Controller, Get, HttpCode, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Product as ProductInterface } from './graphql-schema';
import { Product as ProductClass, ProductFilter } from './graphql/graphql-schema';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('product')
  async getProduct(@Query('ean') ean: string): Promise<ProductInterface> {
    return await this.appService.getProduct(ean);
  }

  @Get('product/getAndCreate')
  async getProductByUrl(@Query('url') url: string): Promise<ProductInterface> {
    return await this.appService.getProductBy(url, null);
  }

  @Get('product/filter')
  async getProductMatch(@Req() request: Request): Promise<ProductInterface[]> {
    return await this.appService.getProductMatch(request.query)
  }

  @Get('scrape/')
  async scrapeProducts(@Query('url') url: string) {
    return await this.appService.createOrUpdateProd(url)
  }

  @Get('product/update')
  async updateProdImage(@Query('prop') prop: string, @Query('url') url: string) {
    return await this.appService.updateProductImage(prop, url)
  }
}
