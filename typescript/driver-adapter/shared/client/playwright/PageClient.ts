import { Page, Locator } from '@playwright/test';
import type { Optional } from '@optivem/commons';
import { Decimal } from '@optivem/commons';

/**
 * High-level wrapper for Playwright Page.
 */
export class PageClient {
    private readonly page: Page;
    private readonly baseUrl: string;
    private readonly timeoutMilliseconds: number;

    private static readonly DEFAULT_TIMEOUT_SECONDS = 30;
    private static readonly DEFAULT_TIMEOUT_MILLISECONDS = PageClient.DEFAULT_TIMEOUT_SECONDS * 1000;

    constructor(page: Page, baseUrl: string, timeoutMilliseconds: number = PageClient.DEFAULT_TIMEOUT_MILLISECONDS) {
        this.page = page;
        this.baseUrl = baseUrl;
        this.timeoutMilliseconds = timeoutMilliseconds;
    }

    getBaseUrl(): string {
        return this.baseUrl;
    }

    getPage(): Page {
        return this.page;
    }

    /** Returns locator without waiting. */
    getLocator(selector: string): Locator {
        return this.page.locator(selector);
    }

    async fillAsync(selector: string, text: Optional<string>): Promise<void> {
        const input = await this.getLocatorAsync(selector);
        await input.fill(text ?? '');
    }

    async clickAsync(selector: string): Promise<void> {
        const button = await this.getLocatorAsync(selector);
        await button.click();
    }

    async readTextContentAsync(selector: string): Promise<string> {
        const locator = await this.getLocatorAsync(selector);
        return (await locator.textContent()) || '';
    }

    /** Returns text without waiting for visibility. */
    async readTextContentImmediatelyAsync(selector: string): Promise<string> {
        const locator = this.page.locator(selector);
        return (await locator.textContent()) || '';
    }

    async readAllTextContentsAsync(selector: string): Promise<string[]> {
        const locator = this.page.locator(selector);
        await locator.first().waitFor({ state: 'visible', timeout: this.timeoutMilliseconds });
        return await locator.allTextContents();
    }

    async isVisibleAsync(selector: string): Promise<boolean> {
        try {
            const locator = await this.getLocatorAsync(selector);
            return (await locator.count()) > 0;
        } catch {
            return false;
        }
    }

    async isHiddenAsync(selector: string): Promise<boolean> {
        const locator = this.page.locator(selector);
        return (await locator.count()) === 0;
    }

    /** Same as isVisibleAsync; kept for backward compatibility. */
    async existsAsync(selector: string): Promise<boolean> {
        return this.isVisibleAsync(selector);
    }

    async readInputValueAsync(selector: string): Promise<string> {
        const locator = await this.getLocatorAsync(selector);
        return await locator.inputValue();
    }

    async readInputIntegerValueAsync(selector: string): Promise<number> {
        const inputValue = await this.readInputValueAsync(selector);
        return parseInt(inputValue);
    }

    async readInputCurrencyDecimalValueAsync(selector: string): Promise<Decimal> {
        let inputValue = await this.readInputValueAsync(selector);
        inputValue = inputValue.replace('$', '');
        return Decimal.fromString(inputValue);
    }

    async readInputPercentageDecimalValueAsync(selector: string): Promise<Decimal> {
        let inputValue = await this.readInputValueAsync(selector);
        inputValue = inputValue.replace('%', '');
        return Decimal.fromString(inputValue);
    }

    async waitForHiddenAsync(selector: string): Promise<void> {
        const locator = this.page.locator(selector);
        await locator.waitFor({ state: 'hidden', timeout: this.timeoutMilliseconds });
    }

    async waitForVisibleAsync(selector: string, timeoutMilliseconds?: number): Promise<void> {
        const locator = this.page.locator(selector);
        const timeout = timeoutMilliseconds ?? this.timeoutMilliseconds;
        await locator.waitFor({ state: 'visible', timeout });
    }

    async readAttributeAsync(selector: string, attributeName: string): Promise<string | null> {
        const locator = this.page.locator(selector);
        return await locator.getAttribute(attributeName);
    }

    private async getLocatorAsync(selector: string): Promise<Locator> {
        const locator = this.page.locator(selector);
        await locator.waitFor(this.getDefaultWaitForOptions());
        const count = await locator.count();
        if (count === 0) {
            throw new Error(`No elements found for selector: ${selector}`);
        }
        return locator;
    }

    private getDefaultWaitForOptions(): { state: 'visible'; timeout: number } {
        return { state: 'visible', timeout: this.timeoutMilliseconds };
    }
}
