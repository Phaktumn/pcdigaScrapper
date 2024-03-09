import { Injectable } from '@nestjs/common';
import { LaunchOptions } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import { transformPricesToNumber } from 'src/common/utils';
import { ScrapperServiceBase } from './scraper.servicebase';

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

@Injectable()
export class GlobalDataScraperService extends ScrapperServiceBase {
  async pageScraping(pageUrl: string) {
    super.CreateBrowser();
    super.GoTo(pageUrl);

    const data = await this.page.evaluate(() => {

      const currentPrice: HTMLElement = document.querySelector(
        'body > main > div.main-container > div.bg-white.pb-4.mb-4 > div:nth-child(2) > div > ck-product-cta-box > div > * > span > span.price__amount'
        );

      const originalPrice: HTMLElement = document.querySelector(
        'body > main > div.main-container > div.bg-white.pb-4.mb-4 > div:nth-child(2) > div > ck-product-cta-box > div > * > span > span.price__strike-price-info.d-block > span.price__amount--original.price__amount--original-msrp.font-size-inherit'
        );

      // No discount value in globaldata
      const priceDifference: HTMLElement = null;

      const name: HTMLElement = document.querySelector('body > main > div.main-container > div.bg-white.pb-4.mb-4 > div:nth-child(2) > div > ck-product-cta-box > div > div.ck-thumbnail-on-scroll.mb-2 > div.ck-thumbnail-on-scroll-text > h1');

      const ean: HTMLElement = document.querySelector('body > main > div.main-container > div.bg-white.pb-4.mb-4 > div:nth-child(2) > div > div > ck-product-sku-ean-warranty-info > div:nth-child(2)');

      const image: NodeListOf<Element> = document.querySelectorAll(
        'div > div > div.swiper-slide > img'
      );

      const sku: HTMLElement = document.querySelector('body > main > div.main-container > div.bg-white.pb-4.mb-4 > div:nth-child(2) > div > div > ck-product-sku-ean-warranty-info > div:nth-child(1)');

      return {
        currentPrice: currentPrice ? currentPrice.innerText : '0',
        originalPrice: originalPrice
          ? originalPrice.innerText
          : (!currentPrice ? '0' : currentPrice.innerText),
        priceDifference: priceDifference ? priceDifference.innerText : '0',
        name: !name ? "NAME FAILED" : name.innerText,
        ean: !ean ? "EAN FAILED" : ean.innerText.replace('EAN', '').trim(),
        image: !image ? "https://assets.globaldata.pt/assets/globaldata/images/logo.svg" : image[0].getAttribute('src'),
        sku: !sku ? "SKU FAILED" : sku.innerText.replace('SKU', '').trim(),
      };
    });
    await this.browser.close();
    return {
      ...data,
      currentPrice: transformPricesToNumber(data.currentPrice),
      originalPrice: transformPricesToNumber(data.originalPrice),
      priceDifference: transformPricesToNumber(data.priceDifference),
    };
  }
}
