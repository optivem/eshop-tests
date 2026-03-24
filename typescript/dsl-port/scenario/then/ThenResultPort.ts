import type { OrderStatus } from '@optivem/driver-port/shop/dtos/OrderStatus.js';
import type { ThenGivenClockPort, ThenGivenProductPort, ThenGivenCountryPort } from './ThenGivenPort.js';

export interface ThenClausePort {
    shouldSucceed(): ThenSuccessPort;
    shouldFail(): ThenFailurePort;
}

export interface ThenSuccessPort extends PromiseLike<void> {
    and(): this;
    order(orderNumber?: string): ThenOrderPort;
    coupon(couponCode?: string): ThenCouponPort;
    clock(): Promise<ThenGivenClockPort>;
    product(skuAlias: string): Promise<ThenGivenProductPort>;
    country(countryAlias: string): Promise<ThenGivenCountryPort>;
}

export interface ThenFailurePort extends PromiseLike<void> {
    errorMessage(expectedMessage: string): this;
    fieldErrorMessage(expectedField: string, expectedMessage: string): this;
    and(): ThenFailureAndPort;
}

export interface ThenFailureAndPort {
    order(orderNumber?: string): ThenOrderPort;
    coupon(couponCode?: string): ThenCouponPort;
    clock(): Promise<ThenGivenClockPort>;
    product(skuAlias: string): Promise<ThenGivenProductPort>;
    country(countryAlias: string): Promise<ThenGivenCountryPort>;
}

export interface ThenOrderPort extends PromiseLike<void> {
    and(): this;
    hasSku(expectedSku: string): this;
    hasQuantity(expectedQuantity: number): this;
    hasCountry(expectedCountry: string): this;
    hasUnitPrice(expectedUnitPrice: number): this;
    hasBasePrice(basePrice: number | string): this;
    hasSubtotalPrice(subtotalPrice: number | string): this;
    hasTotalPrice(totalPrice: number | string): this;
    hasStatus(expectedStatus: OrderStatus): this;
    hasDiscountRateGreaterThanOrEqualToZero(): this;
    hasDiscountRate(discountRate: number): this;
    hasDiscountAmount(discountAmount: number | string): this;
    hasAppliedCoupon(expectedCouponCode: string | null): this;
    hasAppliedCoupon(): this;
    hasDiscountAmountGreaterThanOrEqualToZero(): this;
    hasSubtotalPriceGreaterThanZero(): this;
    hasTaxRate(taxRate: number | string): this;
    hasTaxRateGreaterThanOrEqualToZero(): this;
    hasTaxAmount(taxAmount: number | string): this;
    hasTaxAmountGreaterThanOrEqualToZero(): this;
    hasTotalPriceGreaterThanZero(): this;
    hasOrderNumberPrefix(expectedPrefix: string): this;
}

export interface ThenCouponPort extends PromiseLike<void> {
    and(): this;
    hasDiscountRate(discountRate: number): this;
    isValidFrom(validFrom: string): this;
    isValidTo(validTo: string): this;
    hasUsageLimit(usageLimit: number): this;
    hasUsedCount(usedCount: number): this;
}
