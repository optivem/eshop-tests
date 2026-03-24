import type { OrderStatus } from '@optivem/driver-port/shop/dtos/OrderStatus.js';
import type { StringInput, NumberLikeInput } from '../Types.js';
import type { WhenClausePort } from '../when/WhenStagePort.js';
import type { ThenGivenStagePort } from '../then/ThenGivenPort.js';

export interface GivenClausePort {
    product(): GivenProductPort;
    order(): GivenOrderPort;
    clock(): GivenClockPort;
    country(): GivenCountryPort;
    coupon(): GivenCouponPort;
    when(): WhenClausePort;
    then(): ThenGivenStagePort;
    and(): GivenClausePort;
}

export interface GivenProductPort {
    withSku(sku: StringInput): this;
    withUnitPrice(unitPrice: NumberLikeInput | undefined): this;
    and(): GivenClausePort;
    when(): WhenClausePort;
    then(): ThenGivenStagePort;
}

export interface GivenOrderPort {
    withOrderNumber(orderNumber: StringInput): this;
    withSku(sku: StringInput): this;
    withQuantity(quantity: number | string | null | undefined): this;
    withCountry(country: StringInput): this;
    withCouponCode(couponCodeAlias: StringInput): this;
    withStatus(status: OrderStatus): this;
    and(): GivenClausePort;
    when(): WhenClausePort;
    then(): ThenGivenStagePort;
}

export interface GivenClockPort {
    withTime(time: StringInput): this;
    and(): GivenClausePort;
    when(): WhenClausePort;
    then(): ThenGivenStagePort;
}

export interface GivenCountryPort {
    withCode(country: StringInput): this;
    withTaxRate(taxRate: NumberLikeInput | undefined): this;
    and(): GivenClausePort;
    when(): WhenClausePort;
    then(): ThenGivenStagePort;
}

export interface GivenCouponPort {
    withCouponCode(couponCode: StringInput): this;
    withDiscountRate(discountRate: NumberLikeInput | undefined): this;
    withValidFrom(validFrom: StringInput): this;
    withValidTo(validTo: StringInput): this;
    withUsageLimit(usageLimit: number | string | null | undefined): this;
    and(): GivenClausePort;
    when(): WhenClausePort;
    then(): ThenGivenStagePort;
}
