import { Injectable } from '@nestjs/common';
import { Browser, LaunchOptions, Page } from 'puppeteer';
import { transformPricesToNumber } from 'src/common/utils';
import * as randomUseragent from 'random-useragent';
import puppeteer from 'puppeteer-extra';
import { ScrapperServiceBase } from './scraper.servicebase';


@Injectable()
export class ScraperService extends ScrapperServiceBase {
  async pageScraping(pageUrl: string) {
    super.CreateBrowser();
    super.GoTo(pageUrl);


    while (true) {
      var res = await this.page.evaluate(() => {
        const isCaptcha = document.querySelector('div#cf-hcaptcha-container') !== null;
        const isInput = document.querySelector('#cf-norobot-container > input') !== null;
        const isSeller = document.querySelector('#__next > * main') !== null;
        return { Captcha: isCaptcha, Input: isInput, Seller: isSeller };
      });

      if (!res.Captcha && !res.Input && !res.Seller || res.Captcha) {
        await this.page.setUserAgent(randomUseragent.getRandom());
        await this.page.reload({ waitUntil: 'networkidle2' });
        await this.page.waitForFunction(() => document.querySelectorAll('div#cf-hcaptcha-container, #cf-norobot-container > input, #__next > * main'),
          { timeout: 3000 });
      }
      else {
        if (res.Seller) {
          break;
        }
        const min = Math.ceil(350);
        const max = Math.floor(800);
        this.page.click('#cf-norobot-container > input', {
          button: 'left',
          delay: Math.floor(Math.random() * (max - min)) + min,
        });

        try {
          console.log('trying to find seller');
          await this.page.waitForSelector('#__next > * main', { timeout: 10000 });
          break;
        }
        catch (e) {
          console.log('reloading');
          await this.page.setUserAgent(randomUseragent.getRandom());
          await this.page.reload({ waitUntil: 'networkidle2' });
          await this.page.waitForFunction(() => document.querySelectorAll('div#cf-hcaptcha-container, #cf-norobot-container > input, #__next > * main'),
            { timeout: 3000 });
        }
      }
    }

    /**
     * currentPrice
     * originalPrice
     * name
     * image
     * codeElems
     */
    const data = await this.page.evaluate(() => {

      const currentPrice: HTMLElement = document.querySelector(
        '#body-overlay > div.flex.flex-col.justify-between > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div.grid.items-start > div.w-full.mt-6.sticky.top-4.transition-transform.transition-top.duration-300.ease-out > div > div > div.grid.grid-flow-row.gap-y-1 > div > div.flex.gap-x-4.items-center > div'
      );

      const originalPrice: HTMLElement = document.querySelector(
        '#body-overlay > div.flex.flex-col.justify-between.z-1 > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div.grid.items-start.w-full > div.w-full.mt-6.sticky.top-4.transition-transform.transition-top.duration-300.ease-out > div > div > div.grid.grid-flow-row.gap-y-1 > div > div.flex.gap-x-4.items-center > div.pvpr-lh.undefined.flex.justify-end.self-end.flex-col > p'
      );

      const name: HTMLElement = document.querySelector(
        '#body-overlay > div.flex.flex-col.justify-between.z-1 > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div.grid.items-start.w-full > div.w-full.mt-6.sticky.top-4.transition-transform.transition-top.duration-300.ease-out > div > div > h1'
      );

      const image: NodeListOf<HTMLElement> = document.querySelectorAll(
        '#body-overlay > div.flex.flex-col.justify-between.min-h-screen.z-1 > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div.grid.items-start.w-full > div.max-w-full.mt-6 > div.grid.p-4 > div.hidden > div.parent-grid-full > div > div > div > div > div > div > img'
      );

      const codeElems: NodeListOf<HTMLElement> = document.querySelectorAll(
        '#body-overlay > div.flex.flex-col.justify-between.min-h-screen.z-1 > div.z-1.base-container.py-5.bg-background.pb-28.flex-grow > main > div > div > div > div.flex > div.flex.flex-col.gap-y-2 > div'
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
    await this.browser.close();
    return {
      ...data,
      currentPrice: transformPricesToNumber(data.currentPrice),
      originalPrice: transformPricesToNumber(data.originalPrice),
      priceDifference: transformPricesToNumber(data.priceDifference),
    };
  }
}
