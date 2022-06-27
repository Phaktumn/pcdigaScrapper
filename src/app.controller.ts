import { Controller, Get, HttpCode, Query, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { Product as ProductInterface } from './graphql/graphql-schema';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('product/create')
  async createProduct(@Query('url') url: string): Promise<ProductInterface>
  {
    return await this.appService.create(url);
  }

  @Get('product/prices')
  async prices(@Query('url') url: string): Promise<ProductInterface>
  {
    return await this.appService.createPrices(url);
  }
  
  @Get('product')
  async getProduct(@Query('sku') sku: string): Promise<ProductInterface> {
    return await this.appService.getProduct(sku);
  }

  @Get('product/getAndCreate')
  async getProductByUrl(@Query('url') url: string): Promise<ProductInterface> {
    return await this.appService.getProductBy(url, null);
  }

  @Get('product/filter')
  async getProductMatch(@Req() request: Request): Promise<ProductInterface[]> {
    return await this.appService.getProductMatch(request.query)
  }

  @Get('scrape')
  async scrapeProducts(@Query('sku') sku: string) {
    return await this.appService.createOrUpdateProd(sku)
  }

  @Get('product/update')
  async updateProdImage(@Query('prop') prop: string, @Query('url') url: string) {
    return await this.appService.updateProductImage(prop, url)
  }
}
