import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Aggregate } from 'mongoose';
import {
  calculateDiscountPercentage,
  isCurrentMonthAndYear,
  isOlderThan24Hours,
  isOlderThan
} from 'src/common/utils';
import { Product, ProductFilter } from 'src/graphql/graphql-schema';
import { ScraperService } from 'src/scraper/scraper.service';
import { ENTITIES_KEY, IgnoredProps } from 'src/shared';
import * as _ from 'lodash';
import { ThirdPartyEmailService } from 'src/third-party/third-party.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(ENTITIES_KEY.PRODUCTS_MODEL)
    private productModel: Model<Product>,
    private scraperService: ScraperService,
    private readonly sendgridService: ThirdPartyEmailService,
  ) { }

  async scrapeProducts(url: string): Promise<Product> {
    let prod: Product = await this.getProduct(url, null);
    if (prod === null)
      return await this.createProduct(url);
    return isOlderThan(new Date(prod.updatedAt), 12, 0)
      ? await this.getPrices(url)
      : prod
  }

  /**
   * 
   * @param ean Codigo EAN do produto
   * @returns 
   */
  async getProductByEan(ean: string): Promise<Product> {
    return await this.productModel.findOne(
      { ean: ean },
      IgnoredProps,
    );
  }

  async productExists(url: string, ean: string): Promise<boolean> {
    if (!url && !ean) {
      throw new HttpException(
        'ERROR.PARAMS_NOT_VALID',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    let filter: FilterQuery<Product> = ean ? { 'ean': ean } : { 'url': url };
    return await this.productModel.exists(filter);
  }

  async createProduct(productUrl: string): Promise<Product> {
    const { currentPrice, originalPrice, priceDifference, name, ean, image } =
      await this.scraperService.pageScraping(productUrl);
    if (!currentPrice)
      throw new HttpException(
        'ERROR.COULDNT_CREATE_PRODUCT',
        HttpStatus.NOT_FOUND,
      );
    var now = new Date(Date.now());
    var dateformated = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear().toString().slice(-2)}`;
    var model = {
      url: productUrl,
      name,
      ean,
      image,
      prices: {
        currentPrice,
        originalPrice,
        priceDifference,
        date: dateformated,
        isOnDiscount: priceDifference > 0,
        discountPercentage: ((priceDifference / originalPrice) * 100).toFixed(
          2,
        ),
      },
    };
    var res = await new this.productModel(model).save();
    return res;
  }

  async getPrices(productUrl: string): Promise<Product> {
    const { currentPrice, originalPrice, priceDifference } =
      await this.scraperService.pageScraping(productUrl);

    if (!currentPrice)
      throw new HttpException(
        'ERROR.COULDNT_CREATE_PRODUCT',
        HttpStatus.NOT_FOUND,
      );
    var now = new Date(Date.now());
    var dateformated = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear().toString().slice(-2)}`;
    const product = await this.productModel.findOneAndUpdate(
      { url: productUrl },
      {
        $push: {
          prices: {
            currentPrice,
            originalPrice,
            priceDifference,
            isOnDiscount: priceDifference > 0,
            date: dateformated,
            discountPercentage: calculateDiscountPercentage(
              priceDifference,
              originalPrice,
            ),
          },
        },
      },
    );

    return product;
  }

  async getProductMatch(filter: any): Promise<Product[]> {
    const computedFilter = {
      $and: [
        filter.name !== undefined ? { 'name': { $regex: '.*' + (filter.name as String | '') + '.*' } } : {},
        filter.url !== undefined ? { 'url': { $regex: '.*' + (filter.url as String | '') + '.*' } } : {},
        filter.ean !== undefined ? { 'ean': { $regex: '.*' + (filter.ean as String | '') + '.*' } } : {},
        {
          $or: [
            { 'prices.currentPrice': { $lte: filter.priceMin | Number.MAX_SAFE_INTEGER } },
            { 'prices.currentPrice': { $gte: filter.priceMax | 0 } }
          ]
        }
      ],
    };
    return await this.productModel.find(computedFilter, IgnoredProps);
  }

  async getProduct(url: string, date: string): Promise<Product> {
    let priceDate;

    date ? (priceDate = new Date(date)) : (priceDate = new Date());

    const product = await this.productModel
      .aggregate([
        {
          $match: {
            url,
          },
        },
        {
          $project: {
            _id: 1,
            url: 1,
            name: 1,
            ean: 1,
            updatedAt: 1,
            Image: 1,
            prices: {
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
      ])
      .exec();

    if (product.length === 0) return null;//return await this.createProduct(url);

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
        url: url
      },
      {
        "image": image,
      },
      {
        new: true,
      }
    );
    return product;
  }
}
