import type { Optional, Result } from '@optivem/commons';
import { Integer } from '@optivem/commons';
import type { ShopDriver } from '../ShopDriver.js';
import type { SystemError } from '../commons/dtos/errors/SystemError.js';
import { ShopUiClient } from './client/ShopUiClient.js';
import { HomePage } from './client/pages/HomePage.js';
import { NewOrderPage } from './client/pages/NewOrderPage.js';
import { OrderHistoryPage } from './client/pages/OrderHistoryPage.js';
import { OrderDetailsPage } from './client/pages/OrderDetailsPage.js';
import { CouponManagementPage } from './client/pages/CouponManagementPage.js';
import { failure, failureWithError, success, successVoid } from '../commons/SystemResults.js';
import type { PlaceOrderRequest, PlaceOrderResponse, ViewOrderResponse } from '../commons/dtos/index.js';
import { OrderStatus } from '../commons/dtos/OrderStatus.js';
import type { PublishCouponRequest, BrowseCouponsResponse } from '../commons/dtos/index.js';

export class ShopUiDriver implements ShopDriver {
    private readonly client: ShopUiClient;
    private currentPage: Page = Page.NONE;

    private homePage: HomePage | null = null;
    private newOrderPage?: NewOrderPage;
    private orderHistoryPage?: OrderHistoryPage;
    private orderDetailsPage?: OrderDetailsPage;
    private couponManagementPage?: CouponManagementPage;

    constructor(baseUrl: string) {
        this.client = new ShopUiClient(baseUrl);
    }

    async close(): Promise<void> {
        await this.client.close();
    }

    async goToShop(): Promise<Result<void, SystemError>> {
        this.homePage = await this.client.openHomePage();
        if (!this.client.isStatusOk() || !(await this.client.isPageLoaded())) {
            return failure('Failed to load home page');
        }
        this.setCurrentPage(Page.HOME);
        return successVoid();
    }

    async placeOrder(request: PlaceOrderRequest): Promise<Result<PlaceOrderResponse, SystemError>> {
        await this.ensureOnNewOrderPage();
        const page = this.newOrderPage!;
        await page.inputSku(request.sku);
        await page.inputQuantity(request.quantity);
        await page.inputCountry(request.country);
        await page.inputCouponCode(request.couponCode);
        await page.clickPlaceOrder();

        const result = await page.getResult();
        if (result.isFailure()) {
            return failureWithError(result.getError());
        }

        const orderNumber = NewOrderPage.getOrderNumber(result.getValue());
        return success({ orderNumber });
    }

    async cancelOrder(orderNumber: Optional<string>): Promise<Result<void, SystemError>> {
        const viewResult = await this.viewOrder(orderNumber);
        if (viewResult.isFailure()) {
            return viewResult.mapVoid();
        }

        await this.orderDetailsPage!.clickCancelOrder();

        const cancelResult = await this.orderDetailsPage!.getResult();
        if (cancelResult.isFailure()) {
            return failureWithError(cancelResult.getError());
        }

        const successMessage = cancelResult.getValue();
        if (!successMessage.includes('cancelled successfully!')) {
            return failure('Did not receive expected cancellation success message');
        }

        const statusAfter = await this.orderDetailsPage!.getStatus();
        if (statusAfter !== OrderStatus.CANCELLED) {
            return failure('Order status not updated to CANCELLED');
        }

        const cancelHidden = await this.orderDetailsPage!.isCancelButtonHidden();
        if (!cancelHidden) {
            return failure('Cancel button still visible');
        }

        return successVoid();
    }

    async viewOrder(orderNumber: Optional<string>): Promise<Result<ViewOrderResponse, SystemError>> {
        const ensured = await this.ensureOnOrderDetailsPage(orderNumber);
        if (ensured.isFailure()) {
            return failureWithError(ensured.getError());
        }

        const page = this.orderDetailsPage!;
        const isLoaded = await page.isLoadedSuccessfully();
        if (!isLoaded) {
            return failure('Order details did not load');
        }

        const orderNumberValue = await page.getOrderNumber();
        const orderTimestamp = await page.getOrderTimestamp();
        const sku = await page.getSku();
        const quantity = await page.getQuantity();
        const country = await page.getCountry();
        const unitPrice = await page.getUnitPrice();
        const basePrice = await page.getBasePrice();
        const discountRate = await page.getDiscountRate();
        const discountAmount = await page.getDiscountAmount();
        const subtotalPrice = await page.getSubtotalPrice();
        const taxRate = await page.getTaxRate();
        const taxAmount = await page.getTaxAmount();
        const totalPrice = await page.getTotalPrice();
        const status = await page.getStatus();
        const appliedCouponCode = await page.getAppliedCoupon();

        return success({
            orderNumber: orderNumberValue,
            orderTimestamp,
            sku,
            quantity: Integer.fromNumber(quantity),
            country,
            unitPrice,
            basePrice,
            discountRate,
            discountAmount,
            subtotalPrice,
            taxRate,
            taxAmount,
            totalPrice,
            status,
            appliedCouponCode,
        });
    }

    async publishCoupon(request: PublishCouponRequest): Promise<Result<void, SystemError>> {
        await this.ensureOnCouponManagementPage();
        const page = this.couponManagementPage!;
        await page.inputCouponCode(request.code);
        await page.inputDiscountRate(request.discountRate);
        await page.inputValidFrom(request.validFrom);
        await page.inputValidTo(request.validTo);
        await page.inputUsageLimit(request.usageLimit);
        await page.clickPublishCoupon();
        return page.getResult().then((result: import('@optivem/commons').Result<string, SystemError>) => result.mapVoid());
    }

    async browseCoupons(): Promise<Result<BrowseCouponsResponse, SystemError>> {
        await this.navigateToCouponManagementPage();
        const coupons = await this.couponManagementPage!.readCoupons();
        return success({ coupons });
    }

    private async getHomePage(): Promise<HomePage> {
        if (this.homePage == null || !this.isOnPage(Page.HOME)) {
            this.homePage = await this.client.openHomePage();
            this.setCurrentPage(Page.HOME);
        }
        return this.homePage;
    }

    private isOnPage(page: Page): boolean {
        return this.currentPage === page;
    }

    private setCurrentPage(page: Page): void {
        this.currentPage = page;
    }

    private getCurrentPage(): Page {
        return this.currentPage;
    }

    private async ensureOnNewOrderPage(): Promise<void> {
        if (this.getCurrentPage() !== Page.NEW_ORDER) {
            const homePage = await this.getHomePage();
            this.newOrderPage = await homePage.clickNewOrder();
            this.setCurrentPage(Page.NEW_ORDER);
        }
    }

    private async ensureOnOrderHistoryPage(): Promise<void> {
        if (this.getCurrentPage() !== Page.ORDER_HISTORY) {
            const homePage = await this.getHomePage();
            this.orderHistoryPage = await homePage.clickOrderHistory();
            this.setCurrentPage(Page.ORDER_HISTORY);
        }
    }

    private async ensureOnOrderDetailsPage(orderNumber: Optional<string>): Promise<Result<void, SystemError>> {
        await this.ensureOnOrderHistoryPage();
        await this.orderHistoryPage!.inputOrderNumber(orderNumber);
        await this.orderHistoryPage!.clickSearch();

        const isOrderListed = await this.orderHistoryPage!.waitForOrderRow(orderNumber);
        if (!isOrderListed) {
            return failure(`Order ${orderNumber} does not exist.`);
        }

        this.orderDetailsPage = await this.orderHistoryPage!.clickViewOrderDetails(orderNumber);
        this.setCurrentPage(Page.ORDER_DETAILS);
        return successVoid();
    }

    private async ensureOnCouponManagementPage(): Promise<void> {
        if (this.getCurrentPage() !== Page.COUPON_MANAGEMENT) {
            await this.navigateToCouponManagementPage();
        }
    }

    private async navigateToCouponManagementPage(): Promise<void> {
        const homePage = await this.getHomePage();
        this.couponManagementPage = await homePage.clickCouponManagement();
        this.setCurrentPage(Page.COUPON_MANAGEMENT);
    }
}

const Page = {
    NONE: 'NONE',
    HOME: 'HOME',
    NEW_ORDER: 'NEW_ORDER',
    ORDER_HISTORY: 'ORDER_HISTORY',
    ORDER_DETAILS: 'ORDER_DETAILS',
    COUPON_MANAGEMENT: 'COUPON_MANAGEMENT',
} as const;
type Page = (typeof Page)[keyof typeof Page];

