import { BasePage } from './BasePage.js';
import type { PageClient } from '@optivem/driver-adapter/client/playwright';
import { Integer } from '@optivem/commons';
import type { Optional } from '@optivem/commons';
import type { CouponDto } from '../../../commons/dtos/BrowseCouponsResponse.js';

export class CouponManagementPage extends BasePage {
    private static readonly COUPON_CODE_INPUT_SELECTOR = '[aria-label="Coupon Code"]';
    private static readonly DISCOUNT_RATE_INPUT_SELECTOR = '[aria-label="Discount Rate"]';
    private static readonly VALID_FROM_INPUT_SELECTOR = '[aria-label="Valid From"]';
    private static readonly VALID_TO_INPUT_SELECTOR = '[aria-label="Valid To"]';
    private static readonly USAGE_LIMIT_INPUT_SELECTOR = '[aria-label="Usage Limit"]';
    private static readonly PUBLISH_COUPON_BUTTON_SELECTOR = '[aria-label="Create Coupon"]';
    private static readonly COUPONS_TABLE_SELECTOR = '[aria-label="Coupons Table"]';

    private static readonly TABLE_CELL_CODE_SELECTOR = 'table.table tbody tr td:nth-child(1)';
    private static readonly TABLE_CELL_DISCOUNT_SELECTOR = 'table.table tbody tr td:nth-child(2)';
    private static readonly TABLE_CELL_VALID_FROM_SELECTOR = 'table.table tbody tr td:nth-child(3)';
    private static readonly TABLE_CELL_VALID_TO_SELECTOR = 'table.table tbody tr td:nth-child(4)';
    private static readonly TABLE_CELL_USAGE_LIMIT_SELECTOR = 'table.table tbody tr td:nth-child(5)';
    private static readonly TABLE_CELL_USED_COUNT_SELECTOR = 'table.table tbody tr td:nth-child(6)';
    private static readonly TABLE_EMPTY_STATE_SELECTOR = 'table.table tbody td.text-muted';

    private static readonly PERCENT_SYMBOL = '%';
    private static readonly TEXT_UNLIMITED = 'Unlimited';

    constructor(pageClient: PageClient) {
        super(pageClient);
    }

    async inputCouponCode(couponCode: Optional<string>): Promise<void> {
        await this.pageClient.fillAsync(CouponManagementPage.COUPON_CODE_INPUT_SELECTOR, couponCode);
    }

    async inputDiscountRate(discountRate: Optional<string>): Promise<void> {
        await this.pageClient.fillAsync(CouponManagementPage.DISCOUNT_RATE_INPUT_SELECTOR, discountRate);
    }

    async inputValidFrom(validFrom: Optional<string>): Promise<void> {
        const datetimeValue = CouponManagementPage.getValidFromDateTimeString(validFrom);
        await this.pageClient.fillAsync(CouponManagementPage.VALID_FROM_INPUT_SELECTOR, datetimeValue);
    }

    async inputValidTo(validTo: Optional<string>): Promise<void> {
        const datetimeValue = CouponManagementPage.getValidToDateTimeString(validTo);
        await this.pageClient.fillAsync(CouponManagementPage.VALID_TO_INPUT_SELECTOR, datetimeValue);
    }

    private static getValidFromDateTimeString(validFrom: Optional<string>): string {
        if (validFrom == null || validFrom === '') return '';
        // Extract date from ISO 8601 (2024-06-01T00:00:00Z -> 2024-06-01T00:00)
        return validFrom.substring(0, 10) + 'T00:00';
    }

    private static getValidToDateTimeString(validTo: Optional<string>): string {
        if (validTo == null || validTo === '') return '';
        // Extract date from ISO 8601 (2024-08-31T23:59:59Z -> 2024-08-31T23:59)
        return validTo.substring(0, 10) + 'T23:59';
    }

    async inputUsageLimit(usageLimit: Optional<string>): Promise<void> {
        await this.pageClient.fillAsync(CouponManagementPage.USAGE_LIMIT_INPUT_SELECTOR, usageLimit);
    }

    async clickPublishCoupon(): Promise<void> {
        await this.pageClient.clickAsync(CouponManagementPage.PUBLISH_COUPON_BUTTON_SELECTOR);
    }

    async hasCouponsTable(): Promise<boolean> {
        return await this.pageClient.isVisibleAsync(CouponManagementPage.COUPONS_TABLE_SELECTOR);
    }

    async readCoupons(): Promise<CouponDto[]> {
        if (!(await this.hasCouponsTable())) return [];

        // Wait for table loading to complete before reading data.
        // During loading/empty states the frontend renders a single colSpan'd <td>,
        // while data rows have multiple <td> elements per row.
        // Use or() to wait for either data rows (td:nth-child(2)) or empty state (td.text-muted).
        const dataLocator = this.pageClient.getLocator(CouponManagementPage.TABLE_CELL_DISCOUNT_SELECTOR);
        const emptyLocator = this.pageClient.getLocator(CouponManagementPage.TABLE_EMPTY_STATE_SELECTOR);
        try {
            await dataLocator.or(emptyLocator).first().waitFor({ state: 'visible' });
        } catch {
            return [];
        }
        if ((await dataLocator.count()) === 0) return [];

        const codes = await this.pageClient.readAllTextContentsAsync(
            CouponManagementPage.TABLE_CELL_CODE_SELECTOR
        );
        if (codes.length === 0) return [];
        const coupons: CouponDto[] = [];
        const discountRates = await this.pageClient.readAllTextContentsAsync(
            CouponManagementPage.TABLE_CELL_DISCOUNT_SELECTOR
        );
        const validFroms = await this.pageClient.readAllTextContentsAsync(
            CouponManagementPage.TABLE_CELL_VALID_FROM_SELECTOR
        );
        const validTos = await this.pageClient.readAllTextContentsAsync(
            CouponManagementPage.TABLE_CELL_VALID_TO_SELECTOR
        );
        const usageLimits = await this.pageClient.readAllTextContentsAsync(
            CouponManagementPage.TABLE_CELL_USAGE_LIMIT_SELECTOR
        );
        const usedCounts = await this.pageClient.readAllTextContentsAsync(
            CouponManagementPage.TABLE_CELL_USED_COUNT_SELECTOR
        );
        const rowCount = Math.min(
            codes.length,
            discountRates.length,
            validFroms.length,
            validTos.length,
            usageLimits.length,
            usedCounts.length
        );
        for (let i = 0; i < rowCount; i++) {
            const discountText =
                discountRates[i]?.replace(CouponManagementPage.PERCENT_SYMBOL, '').trim() ?? '0';
            const rate = parseFloat(discountText) / 100 || 0;
            const usageLimitText = usageLimits[i]?.trim() ?? '';
            coupons.push({
                code: codes[i]?.trim() ?? '',
                discountRate: rate,
                validFrom: validFroms[i] ?? '',
                validTo: validTos[i] ?? '',
                usageLimit:
                    usageLimitText === CouponManagementPage.TEXT_UNLIMITED
                        ? undefined
                        : Integer.fromString(usageLimitText || '0'),
                usedCount: Integer.fromString(usedCounts[i] ?? '0'),
            });
        }
        return coupons;
    }
}




