import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Aggregate } from 'mongoose';
import {
  calculateDiscountPercentage,
  isCurrentMonthAndYear,
  isOlderThan24Hours,
  isOlderThan,
} from 'src/common/utils';
import { Product } from 'src/graphql/graphql-schema';
import { ScraperService } from 'src/scraper/scraper.service';
import { ENTITIES_KEY, IgnoredProps, SELLER_NAMES } from 'src/shared';
import * as _ from 'lodash';
import { ThirdPartyEmailService } from 'src/third-party/third-party.service';
import { GlobalDataScraperService } from 'src/scraper/globadata-scrapper.service';
import { Seller } from 'src/graphql-schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ENTITIES_KEY.PRODUCTS_MODEL)
    private productModel: Model<Product>,
    private scraperService: ScraperService,
    private globalDataScraperService: GlobalDataScraperService,
    private readonly sendgridService: ThirdPartyEmailService,
  ) { }

  /**
   * ............{seller_name}.com/
   * ............{seller_name}.pt/
   * https://www.pcdiga.com/
   * productUrl.slice(12).split('.')
   * ['pcdiga', 'com/...']
   * [0] = 'pcdiga'
   * @param productUrl
   * @returns The product scraped from the proper seller
   */
  async validateUrl(productUrl: string) {
    var sellerName = productUrl.slice(12).split('.')[0];
    console.log(sellerName);
    var scrappedValue: any = {};
    switch (sellerName) {
      case SELLER_NAMES.GLOBAL_DATA:
        scrappedValue = await this.globalDataScraperService.pageScraping(
          productUrl,
        );
        break;
      case SELLER_NAMES.PC_DIGA:
        scrappedValue = await this.scraperService.pageScraping(productUrl);
        break;
      default:
        throw new HttpException('ERROR.SELLER_NOT_FOUND', HttpStatus.NOT_FOUND);
    }
    return { sellerName, scrappedValue };
  }

  async scrapeProducts(sku: string): Promise<Product> {
    console.log(sku);
    const prod: Product = await this.productModel.findOne({ sku: sku });
    if (prod === null)
      throw new HttpException({ Error: 'ERROR.PRODUCT_NOT_FOUND', Param: 'SKU not present' }, 400);
    if (isOlderThan(new Date(prod.updatedAt), 12, 0)) {
      console.log(prod);
      prod.sellers.forEach(element => {
        this.getPrices(element.url);
      });
      return await this.productModel.findOne({ sku: sku });
    }
    else {
      throw new HttpException(`ERROR.CANT_PROCESS_NOW Wait atleast 12h before updating again. Last update ${prod.updatedAt}`, HttpStatus.PRECONDITION_FAILED)
    }
  }

  /**
   *
   * @param sku Codigo SKU do produto
   * @returns
   */
  async getProductBySku(sku: string): Promise<Product> {
    return await this.productModel.findOne({ sku: sku }, IgnoredProps);
  }

  async productExists(sku: string): Promise<boolean> {
    if (!sku) {
      throw new HttpException(
        'ERROR.PARAM_NOT_VALID',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    let filter: FilterQuery<Product> = { sku: sku };
    return await this.productModel.exists(filter);
  }

  async createProduct(productUrl: string): Promise<Product> {
    const { scrappedValue, sellerName } = await this.validateUrl(productUrl);
    const now = new Date(Date.now());
    const dateformated = `${now.getDate()}/${now.getMonth() + 1}/${now
      .getFullYear()
      .toString()
      .slice(-2)}`;
    const filter = { sku: scrappedValue.sku };
    const update = {
      $push: {
        sellers: {
          name: sellerName,
          url: productUrl,
          productEan: scrappedValue.ean,
          productPrices: {
            currentPrice: scrappedValue.currentPrice,
            originalPrice: scrappedValue.originalPrice,
            priceDifference: scrappedValue.priceDifference,
            date: dateformated,
            isOnDiscount: scrappedValue.priceDifference > 0,
            discountPercentage: (
              (scrappedValue.priceDifference / scrappedValue.originalPrice) *
              100
            ).toFixed(2),
          },
        },
      },
    };
    const filteredProd: Product = await this.productModel
      .findOne(filter)
      .exec();
    if (filteredProd !== null) {
      if (filteredProd.sellers.find(seller => seller.name === sellerName)){
        throw new HttpException(
          'ERROR.PARAM_NOT_VALID: Seller already exists',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      else {
         return await this.productModel
        .findOneAndUpdate(filter, update, { new: true })
        .exec();
      }
    }
    else {
      var model = {
        sku: scrappedValue.sku,
        image: scrappedValue.image,
        name: scrappedValue.name,
        sellers: {
          name: sellerName,
          url: productUrl,
          productEan: scrappedValue.ean,
          productPrices: {
            currentPrice: scrappedValue.currentPrice,
            originalPrice: scrappedValue.originalPrice,
            priceDifference: scrappedValue.priceDifference,
            date: dateformated,
            isOnDiscount: scrappedValue.priceDifference > 0,
            discountPercentage: (
              (scrappedValue.priceDifference / scrappedValue.originalPrice) *
              100
            ).toFixed(2),
          },
        },
      };
      var res = await new this.productModel(model).save();
      return res;
    }
  }

  async getPrices(productUrl: string): Promise<Product> {
    //Read specific variables
    const { scrappedValue, sellerName } = await this.validateUrl(productUrl);

    if (!scrappedValue.currentPrice)
      throw new HttpException(
        'ERROR.COULDNT_CREATE_PRODUCT',
        HttpStatus.NOT_FOUND,
      );
    var now = new Date(Date.now());
    var dateformated = `${now.getDate()}/${now.getMonth() + 1}/${now
      .getFullYear()
      .toString()
      .slice(-2)}`;

    if ((scrappedValue.sku as String).endsWith('LHR')) {
      scrappedValue.sku = scrappedValue.sku.slice(
        0,
        scrappedValue.sku.length - 3,
      );
    }

    const filter = { sku: scrappedValue.sku };
    const update = {
      $push: {
        sellers: {
          name: sellerName,
          url: productUrl,
          productEan: scrappedValue.ean,
          productPrices: {
            currentPrice: scrappedValue.currentPrice,
            originalPrice: scrappedValue.originalPrice,
            priceDifference: scrappedValue.priceDifference,
            date: dateformated,
            isOnDiscount: scrappedValue.priceDifference > 0,
            discountPercentage: (
              (scrappedValue.priceDifference / scrappedValue.originalPrice) *
              100
            ).toFixed(2),
          },
        },
      },
    };
    const filteredProd: Product = await this.productModel
      .findOne(filter)
      .exec();

    if (filteredProd === null)
      throw new HttpException(
        'ERROR.PRODUCT_NOT_FOUND',
        HttpStatus.NOT_FOUND,
      );

    let sellerExists: Boolean = false;
    for (let index = 0; index < filteredProd.sellers.length; index++) {
      const element = filteredProd.sellers[index];
      sellerExists = element.name === sellerName;
      if (sellerExists)
        break;
    }

    let product: Product = null;
    if (filteredProd === null) {
      throw new HttpException('ERROR.PRODUCT_NOT_FOUND', HttpStatus.NOT_FOUND);
    }

    if (!sellerExists) {
      product = await this.productModel
        .findOneAndUpdate(filter, update, { new: true })
        .exec();
    } else {
      const update = {
        $push: {
          'sellers.$[elem].productPrices': {
            currentPrice: scrappedValue.currentPrice,
            originalPrice: scrappedValue.originalPrice,
            priceDifference: scrappedValue.priceDifference,
            date: dateformated,
            isOnDiscount: scrappedValue.priceDifference > 0,
            discountPercentage: (
              (scrappedValue.priceDifference / scrappedValue.originalPrice) *
              100
            ).toFixed(2),
          },
        },
      };
      const arrayFilters = [{ 'elem.name': sellerName }];
      product = await this.productModel
        .findOneAndUpdate(filter, update, {
          arrayFilters: arrayFilters,
          new: true,
        })
        .exec();
    }

    /**{
        $push: {
          'sellers.$.prices': {
            currentPrice: scrappedValue.currentPrice,
            originalPrice: scrappedValue.originalPrice,
            priceDifference: scrappedValue.priceDifference,
            isOnDiscount: scrappedValue.priceDifference > 0,
            date: dateformated,
            discountPercentage: calculateDiscountPercentage(
              scrappedValue.priceDifference,
              scrappedValue.originalPrice,
            ),
          },
        },
      }, */

    return product;
  }

  async getProductMatch(filter: any): Promise<Product[]> {
    const computedFilter = {
      $and: [
        filter.name !== undefined
          ? { name: { $regex: '.*' + (filter.name as String | '') + '.*' } }
          : {},
        filter.url !== undefined
          ? { url: { $regex: '.*' + (filter.url as String | '') + '.*' } }
          : {},
        filter.sku !== undefined
          ? { sku: { $regex: '.*' + (filter.sku as String | '') + '.*' } }
          : {}
      ],
    };
    return await this.productModel.find(computedFilter, IgnoredProps);
  }

  async getProduct(sku: string, date: string): Promise<Product> {
    let priceDate;
    date ? (priceDate = new Date(date)) : (priceDate = new Date());
    const product = await this.productModel
      .aggregate([
        {
          sku: sku,
        },
        {
          $project: {
            _id: 1,
            sku: 1,
            name: 1,
            updatedAt: 1,
            Image: 1,
            sellers: {
              productPrices: {
                $filter: {
                  input: '$prices',
                  as: 'price',
                  cond: {
                    $and: [
                      {
                        $eq: [
                          { $month: '$$price.createdAt' },
                          priceDate.getMonth() + 1,
                        ],
                      },
                      {
                        $eq: [
                          { $year: '$$price.createdAt' },
                          priceDate.getFullYear(),
                        ],
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      ])
      .exec();

    if (product.length === 0) return null; //return await this.createProduct(url);

    /*if (
      isOlderThan24Hours(_.head(product).updatedAt) &&
      isCurrentMonthAndYear(priceDate)
    ) {
      return await this.getPrices(url);
    }*/

    // const { ean, name, prices } = _.head(product);

    //var res = this.sendgridService.send(ean, name, url, _.head(prices));

    return _.head(product);
  }

  async updateProdImage(url: string): Promise<Product> {
    const { image } = await this.scraperService.pageScraping(url);
    const product = await this.productModel.findOneAndUpdate(
      {
        url: url,
      },
      {
        image: image,
      },
      {
        new: true,
      },
    );
    return product;
  }
}
