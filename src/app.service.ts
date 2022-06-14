import { Injectable } from '@nestjs/common';
import { Product } from './graphql-schema';
import { ProductsService } from './products/products.service';


@Injectable()
export class AppService {
  /**
   *
   */
  constructor(private readonly ProductsService: ProductsService) { }
  getHello(): string {
    return 'Hello World!';
  }
  async getProduct(ean: string): Promise<Product> {
    return await this.ProductsService.getProductByEan(ean);
  }
}
