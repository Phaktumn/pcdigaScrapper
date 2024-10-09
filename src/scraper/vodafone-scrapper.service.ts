import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer-extra';
import { transformPricesToNumber } from 'src/common/utils';

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

@Injectable()
export class VodafoneIphone16DataScraperService {
    async pageScraping(pageUrl: string, capacity: string, color: string) {
        let browser = null;
        const args = ['--no-sandbox'];
        if (!process.env.GOOGLE_CHROME_SHIM) {
            browser = await puppeteer.launch({ headless: true });
        } else {
            try {
                browser = await puppeteer.launch({
                    args: args,
                    headless: true,
                    executablePath: process.env.GOOGLE_CHROME_SHIM,
                });
            } catch (e) {
                browser = await puppeteer.launch({
                    args: args,
                    headless: true,
                    executablePath: process.env.GOOGLE_CHROME_BIN,
                });
            }
        }
        const page = await browser.newPage();
        await page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
        );
        await page.goto(pageUrl, { waitUntil: ['domcontentloaded', 'networkidle2'] });

        const data = await page.evaluate((str: string, clr: string) => {
            const currentPrice: HTMLElement = document.querySelector('#priceModuleComp > div:nth-child(2) > div > div > div > div > div:nth-child(1) > form > div.price-module-options > div > label');

            const originalPrice: HTMLElement = document.querySelector('#priceModuleComp > div:nth-child(2) > div > div > div > div > div:nth-child(1) > form > div.price-module-options > div > label');

            // No discount value in globaldata
            const priceDifference: HTMLElement = null;

            const name: HTMLElement = document.querySelector('#productComp > div > div.stage > div:nth-child(1) > div.stage__header > h1');

            const ean: HTMLElement = null;

            //#imageCmp > div > div > div.carousel__wrapper.stage__carousel--image.align--center > ul > li:nth-child(1) > div > img
            const image: any = document.querySelector('#imageCmp > div > div > div.carousel__wrapper.stage__carousel--image.align--center > ul > li:nth-child(1) > div > img');

            const sku: HTMLElement = null;

            //
            const capacity = str;
            const color = clr;
            
            let storageChildId = 0;
            let clrChildId = 0;
            switch(capacity){
                case '128': storageChildId = 2; break;
                case '256': storageChildId = 3; break;
                case '512': storageChildId = 4; break;
                case '1': storageChildId = 5; break;
            }
            switch (color) {
                case 'Titânio Branco': clrChildId = 2; break;
                case 'Titânio Deserto': clrChildId = 3; break;
                case 'Titânio Natural': clrChildId = 4; break;
                case 'Titânio Preto': clrChildId = 5; break;
            }

            let colorElement: HTMLElement = document.querySelector('#productComp > div > div.stage > div:nth-child(1) > div.stage__info > div > div > div:nth-child(3) > fieldset > div:nth-child(' + clrChildId + ') > div.storage__option.storage__option--unavailable');
            let strgeElement: HTMLElement = document.querySelector('#productComp > div > div.stage > div:nth-child(1) > div.stage__info > div > div > div:nth-child(2) > fieldset > div:nth-child(' + storageChildId + ') > div.storage__option--unavailable');
            
            let unavailable = colorElement !== null || strgeElement !== null;

            return {
                currentPrice: currentPrice ? currentPrice.innerText : '0',
                originalPrice: '0',
                priceDifference: '0',
                name: name.innerText,
                ean: '',
                image: image === null ? '' : image.src,
                sku: name.innerText.replaceAll(' ', '') + capacity + color.replace(' ', ''),
                available: !unavailable,
                options: {
                    storage: capacity,
                    color: color
                }
            };
        }, capacity, color);
        await browser.close();
        return {
            ...data,
            currentPrice: transformPricesToNumber(data.currentPrice),
            originalPrice: transformPricesToNumber(data.originalPrice),
            priceDifference: transformPricesToNumber(data.priceDifference),
        };
    }
}
