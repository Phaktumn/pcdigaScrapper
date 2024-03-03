import { HttpCode, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Product } from './graphql/graphql-schema';
import { ProductsService } from './products/products.service';
import { UpdatableProps } from './shared';

@Injectable()
export class AppService {
  /**
   *
   */
  constructor(private readonly ProductsService: ProductsService) {}
  getHello(): string {
    return 'Welcome';
  }
  
  async create(url: string): Promise<Product> {
    return await this.ProductsService.createProduct(url);
  }

  async createPrices(url: string): Promise<Product> {
    return await this.ProductsService.getPrices(url);
  }

  async getProduct(sku: string): Promise<Product> {
    return await this.ProductsService.getProductBySku(sku);
  }

  async deleteProduct(id: string): Promise<boolean> {
    return await this.ProductsService.deleteProductById(id);
  }

  async getProductMatch(filter: any): Promise<Product[]> {
    return await this.ProductsService.getProductMatch(filter);
  }

  async getProductBy(url: string, ean: string): Promise<Product | any> {
    /*if (await this.ProductsService.productExists(url, ean))
      return { message: 'Product already exists' };
    return await this.ProductsService.getProduct(url, Date.now.toString());*/
    throw new HttpException("ERROR.NOT_IMPLEMENTED", HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async createOrUpdateProd(sku: string): Promise<Product> {
    return await this.ProductsService.scrapeProducts(sku);
    //throw new HttpException("ERROR.NOT_IMPLEMENTED", HttpStatus.INTERNAL_SERVER_ERROR);
  }

  async updateProductImage(prop: string, url: string): Promise<Product | string> {
    if (UpdatableProps.find(x => x == prop) !== null) {
      //return await this.ProductsService.updateProdImage(url);
      throw new HttpException("ERROR.NOT_IMPLEMENTED", HttpStatus.INTERNAL_SERVER_ERROR);
    }
    else return 'Prop ' + prop + ' is not updatable';
  }
}
