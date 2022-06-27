import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import { transformPricesToNumber } from 'src/common/utils';

@Injectable()
export class GlobalDataScraperService {
  async pageScraping(pageUrl: string) {
    let browser = null;
    const args = ['--no-sandbox'];
    if (!process.env.GOOGLE_CHROME_SHIM) {
      browser = await puppeteer.launch({ headless: true });
    } else {
      try {
        browser = await puppeteer.launch({
          args: args,
          //headless: true,
          executablePath: process.env.GOOGLE_CHROME_SHIM,
        });
      } catch (e) {
        browser = await puppeteer.launch({
          args: args,
          //headless: true,
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
      const currentPrice: HTMLElement = document.querySelector('.ck-product-cta-box-inner > div[class=""] > span > span.price__amount:not(.price__amount--original)');

      const originalPrice: HTMLElement = document.querySelector('.ck-product-cta-box-inner > div[class=""] > span > span.price__amount--original');

      // No discount value in globaldata
      const priceDifference: HTMLElement = null;


      const name: HTMLElement = document.querySelector('div.ck-thumbnail-on-scroll-text > h1');

      const ean: HTMLElement = document.querySelector('ck-product-sku-ean-warranty-info > div.ck-product-sku-ean-warranty-info__item.d-inline-block:not(:first-child)');

      const image: HTMLElement = document.querySelector('img.js-slick-image');

      const sku: HTMLElement = document.querySelector('ck-product-sku-ean-warranty-info > div.ck-product-sku-ean-warranty-info__item.d-inline-block');

      return {
        currentPrice: currentPrice ? currentPrice.innerText : 0,
        originalPrice: originalPrice
          ? originalPrice.innerText
          : currentPrice.innerText,
        priceDifference: priceDifference ? priceDifference.innerText : '0',
        name: name.innerText,
        ean: ean.innerText.replace('EAN', '').trim(),
        image: image.getAttribute('href'),
        sku: sku.innerText.replace('SKU', '').trim(),
      };
    });
    await browser.close();
    console.log(data);
    return {
      ...data,
      currentPrice: transformPricesToNumber(data.currentPrice),
      originalPrice: transformPricesToNumber(data.originalPrice),
      priceDifference: transformPricesToNumber(data.priceDifference),
    };
  }
}
