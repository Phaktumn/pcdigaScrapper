import { Injectable } from '@nestjs/common';
import { Product } from './graphql-schema';
import { ProductFilter } from './graphql/graphql-schema';
import { ProductsService } from './products/products.service';

@Injectable()
export class AppService {
  /**
   *
   */
  constructor(private readonly ProductsService: ProductsService) {}
  getHello(): string {
    return 'Hello World!';
  }
  
  async getProduct(ean: string): Promise<Product> {
    return await this.ProductsService.getProductByEan(ean);
  }

  async getProductMatch(filter: any): Promise<Product[]> {
    return await this.ProductsService.getProductMatch(filter);
  }

  async getProductBy(url: string, ean: string): Promise<Product | any> {
    if (await this.ProductsService.productExists(url, ean))
      return { message: 'Product already exists' };
    return await this.ProductsService.getProduct(url, Date.now.toString());
  }

  async createOrUpdateProd(url: string): Promise<Product> {
    return await this.ProductsService.scrapeProducts(url);
  }
}
