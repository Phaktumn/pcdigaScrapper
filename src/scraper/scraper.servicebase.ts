import * as randomUseragent from 'random-useragent';

//import * as puppeteer from 'puppeteer';
import { Browser, ElementHandle, EvaluateFn, LaunchOptions, Page } from 'puppeteer';

// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
import puppeteer from 'puppeteer-extra';

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

export interface IScrapperServiceBase {
    CreateBrowser(): Promise<Browser>;
    GoTo(pageUrl: string, browser: Browser): Promise<Page>;
}

export class ScrapperServiceBase implements IScrapperServiceBase {
    args = ['--disable-setuid-sandbox', '--no-sandbox'];
    options: LaunchOptions = {
        args: this.args,
        headless: true,
        ignoreHTTPSErrors: true,
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    };
    async GoTo(pageUrl: string, browser: Browser): Promise<Page> {
        if (browser === null) {
            browser = await this.CreateBrowser();
        }
        var page = await browser.newPage();
        randomUseragent.getRandom();
        await page.setUserAgent(randomUseragent.getRandom());
        await page.goto(pageUrl, { waitUntil: 'networkidle2' });
        return page;
    }
    async CreateBrowser(): Promise<Browser> {
        let browser: Browser;
        if (!process.env.GOOGLE_CHROME_SHIM) {
            browser = await puppeteer.launch({ ...this.options });
        } else {
            browser = await puppeteer.launch({
                ...this.options,
                executablePath: process.env.GOOGLE_CHROME_BIN,
            });
        }
        return browser;
    }

    ReplaceAll = function(original: string, strReplace: string, strWith: string): string {
        var esc = strReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        var reg = new RegExp(esc, 'ig');
        return original.replace(reg, strWith);
      };
}
