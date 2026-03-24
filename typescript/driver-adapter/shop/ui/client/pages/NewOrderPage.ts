import { BasePage } from './BasePage.js';
import type { PageClient } from '@optivem/driver-adapter/client/playwright';
import type { Optional } from '@optivem/commons';

export class NewOrderPage extends BasePage {
    private static readonly SKU_INPUT_SELECTOR = '[aria-label="SKU"]';
    private static readonly QUANTITY_INPUT_SELECTOR = '[aria-label="Quantity"]';
    private static readonly COUNTRY_INPUT_SELECTOR = '[aria-label="Country"]';
    private static readonly COUPON_CODE_INPUT_SELECTOR = '[aria-label="Coupon Code"]';
    private static readonly PLACE_ORDER_BUTTON_SELECTOR = '[aria-label="Place Order"]';
    private static readonly ORDER_NUMBER_REGEX = /Success! Order has been created with Order Number ([\w-]+)/;
    private static readonly ORDER_NUMBER_MATCHER_GROUP = 1;
    private static readonly ORDER_NUMBER_NOT_FOUND_ERROR = 'Could not find order number';

    constructor(pageClient: PageClient) {
        super(pageClient);
    }

    async inputSku(sku: Optional<string>): Promise<void> {
        await this.pageClient.fillAsync(NewOrderPage.SKU_INPUT_SELECTOR, sku ?? null);
    }

    async inputQuantity(quantity: Optional<string>): Promise<void> {
        await this.pageClient.fillAsync(NewOrderPage.QUANTITY_INPUT_SELECTOR, quantity ?? null);
    }

    async inputCountry(country: Optional<string>): Promise<void> {
        await this.pageClient.fillAsync(NewOrderPage.COUNTRY_INPUT_SELECTOR, country ?? null);
    }

    async inputCouponCode(couponCode: Optional<string>): Promise<void> {
        await this.pageClient.fillAsync(NewOrderPage.COUPON_CODE_INPUT_SELECTOR, couponCode ?? null);
    }

    async clickPlaceOrder(): Promise<void> {
        await this.pageClient.clickAsync(NewOrderPage.PLACE_ORDER_BUTTON_SELECTOR);
    }

    static getOrderNumber(successMessageText: string): string {
        const match = successMessageText.match(NewOrderPage.ORDER_NUMBER_REGEX);
        if (!match) throw new Error(NewOrderPage.ORDER_NUMBER_NOT_FOUND_ERROR);
        return match[NewOrderPage.ORDER_NUMBER_MATCHER_GROUP];
    }
}



