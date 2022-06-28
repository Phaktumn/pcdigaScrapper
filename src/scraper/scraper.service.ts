import { ConsoleLogger, Injectable } from '@nestjs/common';
//import * as puppeteer from 'puppeteer';
import { Browser, ElementHandle, EvaluateFn, LaunchOptions, Page } from 'puppeteer';
import { transformPricesToNumber } from 'src/common/utils';
import * as randomUseragent from 'random-useragent';

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
import puppeteer from 'puppeteer-extra';

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

@Injectable()
export class ScraperService {
  async pageScraping(pageUrl: string) {
    let browser: Browser = null;
    const args = ['--no-sandbox', '--window-size=1920,1080'];
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

    await page.screenshot({ path: 'teste.png', fullPage: true });


    while (true) {
      var res = await page.evaluate(() => {
        const isCaptcha = document.querySelector('div#cf-hcaptcha-container') !== null;
        const isInput = document.querySelector('#cf-norobot-container > input') !== null;
        const isSeller = document.querySelector('#__next > * main') !== null
        return { Captcha: isCaptcha, Input: isInput, Seller: isSeller }
      });
      console.log(res);
      if (!res.Captcha && !res.Input && !res.Seller || res.Captcha) {
        await page.setUserAgent(randomUseragent.getRandom());
        await page.reload({ waitUntil: 'networkidle2' });
        await page.waitForFunction(() =>
          document.querySelectorAll('div#cf-hcaptcha-container, #cf-norobot-container > input, #__next > * main')
          , { timeout: 3000 });
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
          await page.waitForSelector('#__next > * main', { timeout: 10000 });
          break;
        }
        catch (e) {
          console.log('reloading');
          await page.setUserAgent(randomUseragent.getRandom());
          await page.reload({ waitUntil: 'networkidle2' });
          await page.waitForFunction(() =>
            document.querySelectorAll('div#cf-hcaptcha-container, #cf-norobot-container > input, #__next > * main'),
            { timeout: 3000 });
        }
      }
    }

    const data = await page.evaluate(() => {
      const currentPrice: HTMLElement = document.querySelector(
        '#__next > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div.grid.lg\\:grid-cols-product-page.gap-x-6.w-full.items-start > div.w-full.mt-6.sticky.top-4.transition-transform.transition-top.duration-300.ease-out > div > div > div.grid.grid-flow-row.gap-y-1 > div > div.flex.gap-x-4.items-center > div'
      );

      const originalPrice: HTMLElement = document.querySelector(
        '#__next > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div.grid.lg\\:grid-cols-product-page.gap-x-6.w-full.items-start > div.w-full.mt-6.sticky.top-4.transition-transform.transition-top.duration-300.ease-out > div > div > div.grid.grid-flow-row.gap-y-1 > div > div.flex.gap-x-4.items-center > div.pvpr-lh.undefined.flex.flex-col.justify-end.self-end > p',
      );

      //const priceDifference: HTMLElement =
      //  document.querySelector('.discount_value');

      const name: HTMLElement = document.querySelector(
        '#__next > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div.grid.lg\\:grid-cols-product-page.gap-x-6.w-full.items-start > div.w-full.mt-6.sticky.top-4.transition-transform.transition-top.duration-300.ease-out > div > div > h1',
      );

      /*const ean: HTMLElement = document.querySelector(
        '#__next > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div:nth-child(1) > div.hidden > div > div.flex > div.flex.flex-col.gap-y-2.h-full.uppercase > div:nth-child(2)',
      );*/

      const image: NodeListOf<HTMLElement> = document.querySelectorAll(
        '#__next > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div.grid.lg\\:grid-cols-product-page.gap-x-6.w-full.items-start > div.max-w-full.min-w-full.mt-6 > div.p-4.bg-background-off.rounded-md.grid.gap-y-4 > div.hidden.md\\:block.relative > div.grid > div:nth-child(1) > div > img, #__next > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div.grid.lg\\:grid-cols-product-page.gap-x-6.w-full.items-start > div.max-w-full.min-w-full.mt-6 > div.p-4.bg-background-off.rounded-md.grid.gap-y-4 > div.hidden.md\\:block.relative > div.image-container > div > img'
      );

      const codeElems: NodeListOf<HTMLElement> = document.querySelectorAll(
        //'#maincontent > div.columns > div > div.product.attribute-header > div.product.attribute-wrapper > div.product.attribute.partnumber > div.value',
        '#__next > div.z-1.flex.flex-col.justify-between.min-h-screen > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div:nth-child(1) > div.hidden > div > div.flex > div.flex.flex-col.gap-y-2.h-full.uppercase > div'
      );

      return {
        currentPrice: currentPrice ? currentPrice?.innerText : '0',
        originalPrice: originalPrice
          ? originalPrice?.innerText
          : currentPrice?.innerText,
        priceDifference: '0',
        name: name?.innerText,
        ean: codeElems[1]?.innerText.replace('CÓDIGO EAN:', '').trim(),
        image: image[0].getAttribute('src'),
        sku: codeElems[0]?.innerText.replace('PART-NUMBER:', '').trim(),
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
