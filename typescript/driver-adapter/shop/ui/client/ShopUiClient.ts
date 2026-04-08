import { chromium, type Browser, type BrowserContext, type Page, type Response } from '@playwright/test';
import { StatusCodes } from 'http-status-codes';
import { Closer, type AsyncCloseable } from '@optivem/commons';
import { PageClient } from '@optivem/driver-adapter/client/playwright';
import { HomePage } from './pages/HomePage.js';

export class ShopUiClient implements AsyncCloseable {
    private static readonly CONTENT_TYPE = 'content-type';
    private static readonly TEXT_HTML = 'text/html';
    private static readonly HTML_OPENING_TAG = '<html';
    private static readonly HTML_CLOSING_TAG = '</html>';

    private readonly baseUrl: string;
    private browser?: Browser;
    private context?: BrowserContext;
    private page?: Page;
    private readonly homePage: HomePage;
    private response?: Response | null;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.homePage = {} as HomePage;
    }

    private static isHeadless(): boolean {
        const headed = process.env['HEADED'];
        if (headed != null) return !Boolean(JSON.parse(headed));
        return true;
    }

    async openHomePage(): Promise<HomePage> {
        const headless = ShopUiClient.isHeadless();
        this.browser = await chromium.launch({ headless });
        this.context = await this.browser!.newContext();
        this.page = await this.context!.newPage();

        const pageClient = new PageClient(this.page, this.baseUrl);
        const homePage = new HomePage(pageClient);

        this.response = await this.page.goto(this.baseUrl);

        return homePage;
    }

    isStatusOk(): boolean {
        return this.response?.status() === StatusCodes.OK;
    }

    async isPageLoaded(): Promise<boolean> {
        if (!this.response || this.response.status() !== StatusCodes.OK || !this.page) {
            return false;
        }

        const contentType = this.response.headers()[ShopUiClient.CONTENT_TYPE];
        if (!contentType || contentType !== ShopUiClient.TEXT_HTML) {
            return false;
        }

        const pageContent = await this.page.content();
        return (
            pageContent !== null &&
            pageContent.includes(ShopUiClient.HTML_OPENING_TAG) &&
            pageContent.includes(ShopUiClient.HTML_CLOSING_TAG)
        );
    }

    async close(): Promise<void> {
        if (this.page) await Closer.close(this.page);
        if (this.context) await Closer.close(this.context);
        if (this.browser) await Closer.close(this.browser);
    }
}



