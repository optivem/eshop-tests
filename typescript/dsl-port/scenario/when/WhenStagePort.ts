import type { StringInput, NumberLikeInput, NullableNumberLikeInput } from '../Types.js';
import type { ThenClausePort } from '../then/ThenResultPort.js';

export interface WhenClausePort {
    goToShop(): WhenActionPort;
    placeOrder(): WhenPlaceOrderPort;
    cancelOrder(): WhenCancelOrderPort;
    viewOrder(): WhenViewOrderPort;
    publishCoupon(): WhenPublishCouponPort;
    browseCoupons(): WhenActionPort;
}

export interface WhenActionPort {
    then(): ThenClausePort;
}

export interface WhenPlaceOrderPort {
    withOrderNumber(orderNumber: StringInput): this;
    withSku(sku: StringInput): this;
    withQuantity(quantity: NullableNumberLikeInput): this;
    withCountry(country: StringInput): this;
    withCouponCode(couponCode: StringInput): this;
    withCouponCode(): this;
    then(): ThenClausePort;
}

export interface WhenCancelOrderPort {
    withOrderNumber(orderNumber: StringInput): this;
    then(): ThenClausePort;
}

export interface WhenViewOrderPort {
    withOrderNumber(orderNumber: StringInput): this;
    then(): ThenClausePort;
}

export interface WhenPublishCouponPort {
    withCouponCode(couponCode: StringInput): this;
    withDiscountRate(discountRate: NumberLikeInput | undefined): this;
    withValidFrom(validFrom: StringInput): this;
    withValidTo(validTo: StringInput): this;
    withUsageLimit(usageLimit: number | string | null | undefined): this;
    then(): ThenClausePort;
}
