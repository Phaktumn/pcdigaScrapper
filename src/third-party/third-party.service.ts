import { Injectable } from '@nestjs/common';
import { ProductPrice } from 'src/graphql/graphql-schema';
import * as _ from 'lodash';

@Injectable()
export class ThirdPartyEmailService {
  constructor() { }

  async send(ean: string, name: string, url: string, prices: ProductPrice) {
    return {
      Name: name,
      Url: url,
      Current: prices.currentPrice.toString(),
      Original: prices.originalPrice.toString(),
    };
  }
}
