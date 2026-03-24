import type { Optional } from '@optivem/commons';
import { BasePage } from './BasePage.js';
import type { PageClient } from '@optivem/driver-adapter/client/playwright';
import { OrderDetailsPage } from './OrderDetailsPage.js';

export class OrderHistoryPage extends BasePage {
    private static readonly ORDER_NUMBER_INPUT_SELECTOR = '[aria-label="Order Number"]';
    private static readonly SEARCH_BUTTON_SELECTOR = '[aria-label="Refresh Order List"]';
    private static readonly ROW_SELECTOR_TEMPLATE = "//tr[contains(., '%s')]";
    private static readonly VIEW_DETAILS_LINK_SELECTOR_TEMPLATE = "%s//a[contains(text(), 'View Details')]";

    constructor(pageClient: PageClient) {
        super(pageClient);
    }

    async inputOrderNumber(orderNumber: Optional<string>): Promise<void> {
        await this.pageClient.fillAsync(OrderHistoryPage.ORDER_NUMBER_INPUT_SELECTOR, orderNumber);
    }

    async clickSearch(): Promise<void> {
        await this.pageClient.clickAsync(OrderHistoryPage.SEARCH_BUTTON_SELECTOR);
    }

    async waitForOrderRow(orderNumber: Optional<string>, timeoutMilliseconds: number = 10000): Promise<boolean> {
        try {
            const rowSelector = OrderHistoryPage.getRowSelector(orderNumber);
            await this.pageClient.waitForVisibleAsync(rowSelector, timeoutMilliseconds);
            return true;
        } catch {
            return false;
        }
    }

    async isOrderListed(orderNumber: Optional<string>): Promise<boolean> {
        const rowSelector = OrderHistoryPage.getRowSelector(orderNumber);
        return await this.pageClient.isVisibleAsync(rowSelector);
    }

    async clickViewOrderDetails(orderNumber: Optional<string>): Promise<OrderDetailsPage> {
        const rowSelector = OrderHistoryPage.getRowSelector(orderNumber);
        const viewDetailsLinkSelector = OrderHistoryPage.VIEW_DETAILS_LINK_SELECTOR_TEMPLATE.replace(
            '%s',
            rowSelector
        );
        await this.pageClient.clickAsync(viewDetailsLinkSelector);
        return new OrderDetailsPage(this.pageClient);
    }

    private static getRowSelector(orderNumber: Optional<string>): string {
        return OrderHistoryPage.ROW_SELECTOR_TEMPLATE.replace('%s', String(orderNumber));
    }
}



