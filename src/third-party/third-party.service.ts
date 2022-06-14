import { Injectable } from '@nestjs/common';
import * as SendGrid from '@sendgrid/mail';
import { ENV_VARIABLES } from 'src/config/env';
import { ProductPrice } from 'src/graphql/graphql-schema';
import scrapedNowEmail from './emails/scraped-now';
import * as _ from 'lodash';

@Injectable()
export class ThirdPartyEmailService {
  constructor() {
    //SendGrid.setApiKey(ENV_VARIABLES.APP_SEND_GRID_API);
  }

  async send(ean: string, name: string, url: string, prices: ProductPrice) {
    return {
      Name: name,
      Url: url,
      Current: prices.currentPrice.toString(),
      Original: prices.originalPrice.toString()
    };
  }
}
