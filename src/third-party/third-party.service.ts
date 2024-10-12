import { Injectable } from '@nestjs/common';
import { ProductPrice } from 'src/graphql/graphql-schema';
import * as _ from 'lodash';

const sgMail = require('@sendgrid/mail');

@Injectable()
export class ThirdPartyEmailService {

  SENDGRID_API_KEY: string = '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';

  async send(ean: string, name: string, url: string, prices: ProductPrice) {
    return {
      Name: name,
      Url: url,
      Current: prices.currentPrice.toString(),
      Original: prices.originalPrice.toString(),
    };
  }

  async sendIsAvailbale(name: string, url: string, available: boolean) {
    
    sgMail.setApiKey(this.SENDGRID_API_KEY);
    const msg = {
      to: 'fskjorge2@gmail.com',
      from: 'fskjorge@gmail.com',
      subject: 'Vodafone IPhone Availability',
      text: 'Url para o site da vodafone',
      html: '<a href="' + url + '">' + name +'</a>',
    };
    try {
      console.log("sending message");
      await sgMail.send(msg);
      console.log("message sent");
    } catch (ex) {
      console.log("Error sending confirmation email", ex)
    }

    return {
      Name: name,
      Url: url,
      Available: available
    };
  }
}
