import { Injectable } from '@nestjs/common';
import { LaunchOptions } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import { transformPricesToNumber } from 'src/common/utils';

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

@Injectable()
export class GlobalDataScraperService {
  async pageScraping(pageUrl: string) {
    let browser = null;
    const args = ['--disable-setuid-sandbox', '--no-sandbox' ];
    const options: LaunchOptions = {
      args: args,
      headless: true,
      ignoreHTTPSErrors: true,
    };
    if (!process.env.GOOGLE_CHROME_SHIM) {
      browser = await puppeteer.launch({ ...options });
    } else {
      try {
        browser = await puppeteer.launch({
          ...options,
          executablePath: process.env.GOOGLE_CHROME_SHIM,
        });
      } catch (e) {
        browser = await puppeteer.launch({
          ...options,
          executablePath: process.env.GOOGLE_CHROME_BIN,
        });
      }
    }
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
    );
    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    const data = await page.evaluate(() => {

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
    await browser.close();
    return {
      ...data,
      currentPrice: transformPricesToNumber(data.currentPrice),
      originalPrice: transformPricesToNumber(data.originalPrice),
      priceDifference: transformPricesToNumber(data.priceDifference),
    };
  }
}
