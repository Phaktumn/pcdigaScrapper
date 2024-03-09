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
    CreateBrowser() : Promise<Browser>;
    GoTo(pageUrl: string) : Promise<Page>;
}

export class ScrapperServiceBase implements IScrapperServiceBase {
    public browser: Browser = null;
    public page: Page = null;

    args = ['--disable-setuid-sandbox', '--no-sandbox'];
    options: LaunchOptions = {
        args: this.args,
        headless: true,
        ignoreHTTPSErrors: true,
      };

    async GoTo(pageUrl: string) : Promise<Page> {
        if (this.browser === undefined) {
            this.browser = await this.CreateBrowser();
        }
        this.page = await this.browser.newPage();
        randomUseragent.getRandom();
        await this.page.setUserAgent(randomUseragent.getRandom());
        await this.page.goto(pageUrl, { waitUntil: 'networkidle2' });
        return this.page;
    }
    async CreateBrowser() : Promise<Browser> {
        this.browser = null;
    
        if (!process.env.GOOGLE_CHROME_SHIM) {
            this.browser = await puppeteer.launch({ ...this.options });
        } else {
          try {
            this.browser = await puppeteer.launch({
              ...this.options,
              executablePath: process.env.GOOGLE_CHROME_SHIM,
            });
          } catch (e) {
            this.browser = await puppeteer.launch({
              ...this.options,
              executablePath: process.env.GOOGLE_CHROME_BIN,
            });
          }
        }

        return this.browser;
    }
}
