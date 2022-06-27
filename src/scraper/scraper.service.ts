import { ConsoleLogger, Injectable } from '@nestjs/common';
//import * as puppeteer from 'puppeteer';
import { Browser, ElementHandle, LaunchOptions, Page } from 'puppeteer';
import { transformPricesToNumber } from 'src/common/utils';
import * as randomUseragent from 'random-useragent';

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
import puppeteer from 'puppeteer-extra';
import { TimeoutError } from 'rxjs';

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

@Injectable()
export class ScraperService {
  async pageScraping(pageUrl: string) {
    let browser: Browser = null;
    const args = ['--no-sandbox'];
    const options: LaunchOptions = {
      args: args,
      headless: false,
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
    puppeteer.use;

    const page: Page = await browser.newPage();
    randomUseragent.getRandom();
    await page.setUserAgent(randomUseragent.getRandom());

    await page.goto(pageUrl, { waitUntil: 'networkidle2' });
    await page.waitForTimeout(3000);

    while(true) {
      
      var res = await page.evaluate(() => {
        const isCaptcha = document.querySelector('div#cf-hcaptcha-container') !== null;
        const isInput = document.querySelector('#cf-norobot-container > input') !== null;
        const isSeller = document.querySelector('#maincontent') !== null
        return { Captcha: isCaptcha, Input: isInput, Seller: isSeller }
      });
      console.log(res);
      if (!res.Captcha && !res.Input && !res.Seller || res.Captcha)
      {
        await page.setUserAgent(randomUseragent.getRandom());
        await page.reload({ waitUntil: 'networkidle2' });
        await page.waitForTimeout(4000);
      }
      else {
        if (res.Seller) {
          break;
        }
        const min = Math.ceil(350);
        const max = Math.floor(800);
        page.click('#cf-norobot-container > input', {
          button: 'left',
          delay: Math.floor(Math.random() * (max - min)) + min,
        });
        
        try {
          console.log('trying to find seller');
          await page.waitForSelector('#maincontent', { timeout: 10000 });
          break;
        }
        catch (e) {
          console.log('reloading');
          await page.setUserAgent(randomUseragent.getRandom());
          await page.reload({ waitUntil: 'networkidle2' });
          await page.waitForTimeout(4000);
        }
      }
    }

    const data = await page.evaluate(() => {
      const currentPrice: HTMLElement = document.querySelector(
        '.product-info-main .price-box span[data-price-type=finalPrice] .price',
      );

      const originalPrice: HTMLElement = document.querySelector(
        '.product-info-main .price-box span[data-price-type=oldPrice] .price',
      );

      const priceDifference: HTMLElement =
        document.querySelector('.discount_value');

      const name: HTMLElement = document.querySelector(
        '#maincontent > div.columns > div > div.product-info-main > div.page-title-wrapper.product > h1 > span',
      );

      const ean: HTMLElement = document.querySelector(
        '#maincontent > div.columns > div > div.product.attribute-header > div.product.attribute-wrapper > div.product.attribute.ean > div',
      );

      const image: HTMLElement = document.querySelector(
        '#maincontent > div.columns > div.column.main > div.product.media > div.gallery-placeholder > div.fotorama-item > div.fotorama__wrap > div.fotorama__stage > div.fotorama__stage__shaft.fotorama__grab > div.fotorama__active',
      );

      const sku: HTMLElement = document.querySelector(
        '#maincontent > div.columns > div > div.product.attribute-header > div.product.attribute-wrapper > div.product.attribute.partnumber > div.value',
      );

      return {
        currentPrice: currentPrice ? currentPrice?.innerText : null,
        originalPrice: originalPrice
          ? originalPrice?.innerText
          : currentPrice?.innerText,
        priceDifference: priceDifference ? priceDifference?.innerText : '0',
        name: name?.innerText,
        ean: ean?.innerText,
        image: image?.getAttribute('href'),
        sku: sku?.innerText,
      };
    });
    console.log(data);
    await browser.close();
    return {
      ...data,
      currentPrice: transformPricesToNumber(data.currentPrice),
      originalPrice: transformPricesToNumber(data.originalPrice),
      priceDifference: transformPricesToNumber(data.priceDifference),
    };
  }
}
