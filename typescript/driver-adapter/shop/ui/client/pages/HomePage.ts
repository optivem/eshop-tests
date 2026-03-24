import { BasePage } from './BasePage.js';
import type { PageClient } from '@optivem/driver-adapter/client/playwright';
import { NewOrderPage } from './NewOrderPage.js';
import { OrderHistoryPage } from './OrderHistoryPage.js';
import { CouponManagementPage } from './CouponManagementPage.js';

export class HomePage extends BasePage {
    private static readonly SHOP_BUTTON_SELECTOR = "a[href='/shop']";
    private static readonly ORDER_HISTORY_BUTTON_SELECTOR = "a[href='/order-history']";
    private static readonly COUPON_MANAGEMENT_BUTTON_SELECTOR = "a[href='/admin-coupons']";

    constructor(pageClient: PageClient) {
        super(pageClient);
    }

    async clickNewOrder(): Promise<NewOrderPage> {
        await this.pageClient.clickAsync(HomePage.SHOP_BUTTON_SELECTOR);
        return new NewOrderPage(this.pageClient);
    }

    async clickOrderHistory(): Promise<OrderHistoryPage> {
        await this.pageClient.clickAsync(HomePage.ORDER_HISTORY_BUTTON_SELECTOR);
        return new OrderHistoryPage(this.pageClient);
    }

    async clickCouponManagement(): Promise<CouponManagementPage> {
        await this.pageClient.clickAsync(HomePage.COUPON_MANAGEMENT_BUTTON_SELECTOR);
        return new CouponManagementPage(this.pageClient);
    }
}



