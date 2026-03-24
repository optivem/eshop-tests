import { ResponseVerification, UseCaseContext } from '@optivem/dsl-core/shared';
import { Converter } from '@optivem/commons';
import type { Decimal } from '@optivem/commons';
import type { ViewOrderResponse } from '../commons/dtos/index.js';
import { OrderStatus } from '../commons/dtos/OrderStatus.js';
import { expect } from '@playwright/test';

function toNum(v: number | Decimal): number {
    return typeof v === 'number' ? v : (v as Decimal).toNumber();
}

export class ViewOrderVerification extends ResponseVerification<ViewOrderResponse> {
    constructor(response: ViewOrderResponse, context: UseCaseContext) {
        super(response, context);
    }

    orderNumber(orderNumberResultAlias: string): ViewOrderVerification {
        const expectedOrderNumber = this.context.getResultValue(orderNumberResultAlias);
        const actualOrderNumber = this.response.orderNumber;
        expect(actualOrderNumber, `Expected order number to be '${expectedOrderNumber}', but was '${actualOrderNumber}'`)
            .toBe(expectedOrderNumber);
        return this;
    }

    sku(skuParamAlias: string): ViewOrderVerification {
        const expectedSku = this.context.getParamValue(skuParamAlias);
        const actualSku = this.response.sku;
        expect(actualSku, `Expected SKU to be '${expectedSku}', but was '${actualSku}'`)
            .toBe(expectedSku);
        return this;
    }

    quantity(expectedQuantity: number | string): ViewOrderVerification {
        const expected = typeof expectedQuantity === 'string' ? parseInt(expectedQuantity) : expectedQuantity;
        const actualQuantity = this.response.quantity.toNumber();
        expect(actualQuantity, `Expected quantity to be ${expected}, but was ${actualQuantity}`).toBe(expected);
        return this;
    }

    country(expectedCountryAliasOrValue: string): ViewOrderVerification {
        const expectedCountry = this.context.getParamValueOrLiteral(expectedCountryAliasOrValue);
        const actualCountry = this.response.country;
        expect(actualCountry, `Expected country to be '${expectedCountry}', but was '${actualCountry}'`)
            .toBe(expectedCountry);
        return this;
    }

    unitPrice(expectedUnitPrice: number | string): ViewOrderVerification {
        const expected = typeof expectedUnitPrice === 'string' ? parseFloat(expectedUnitPrice) : expectedUnitPrice;
        const actualUnitPrice = toNum(this.response.unitPrice);
        expect(actualUnitPrice, `Expected unit price to be ${expected}, but was ${actualUnitPrice}`).toBe(expected);
        return this;
    }

    subtotalPrice(expectedSubtotalPrice: number | string): ViewOrderVerification {
        const expected =
            typeof expectedSubtotalPrice === 'string' ? parseFloat(expectedSubtotalPrice) : expectedSubtotalPrice;
        const actualSubtotalPrice = toNum(this.response.subtotalPrice);
        expect(actualSubtotalPrice, `Expected subtotal price to be ${expected}, but was ${actualSubtotalPrice}`).toBe(
            expected
        );
        return this;
    }

    subtotalPriceGreaterThanZero(): ViewOrderVerification {
        const subtotalPrice = toNum(this.response.subtotalPrice);
        expect(subtotalPrice, `Subtotal price should be positive, but was: ${subtotalPrice}`).toBeGreaterThan(0);
        return this;
    }

    basePrice(expectedBasePrice: number | string): ViewOrderVerification {
        const expected =
            typeof expectedBasePrice === 'string' ? Converter.toDecimal(expectedBasePrice)!.toNumber() : expectedBasePrice;
        const actualBasePrice = toNum(this.response.basePrice);
        expect(actualBasePrice, `Expected base price to be ${expected}, but was ${actualBasePrice}`).toBe(expected);
        return this;
    }

    basePriceGreaterThanZero(): ViewOrderVerification {
        const basePrice = toNum(this.response.basePrice);
        expect(basePrice, `Base price should be positive, but was: ${basePrice}`).toBeGreaterThan(0);
        return this;
    }

    status(expectedStatus: OrderStatus | string): ViewOrderVerification {
        const expected = typeof expectedStatus === 'string' ? OrderStatus[expectedStatus as keyof typeof OrderStatus] : expectedStatus;
        const actualStatus = this.response.status;
        expect(actualStatus, `Expected status to be ${expected}, but was ${actualStatus}`)
            .toBe(expected);
        return this;
    }

    discountRate(expectedDiscountRate: number | string): ViewOrderVerification {
        const expected =
            typeof expectedDiscountRate === 'string' ? Converter.toDecimal(expectedDiscountRate)!.toNumber() : expectedDiscountRate;
        const actualDiscountRate = toNum(this.response.discountRate);
        expect(actualDiscountRate, `Expected discount rate to be ${expected}, but was ${actualDiscountRate}`).toBe(expected);
        return this;
    }

    discountRateGreaterThanOrEqualToZero(): ViewOrderVerification {
        const discountRate = toNum(this.response.discountRate);
        expect(discountRate, `Discount rate should be non-negative, but was: ${discountRate}`).toBeGreaterThanOrEqual(0);
        return this;
    }

    discountAmount(expectedDiscountAmount: number | string): ViewOrderVerification {
        const expected =
            typeof expectedDiscountAmount === 'string' ? Converter.toDecimal(expectedDiscountAmount)!.toNumber() : expectedDiscountAmount;
        const actualDiscountAmount = toNum(this.response.discountAmount);
        expect(actualDiscountAmount, `Expected discount amount to be ${expected}, but was ${actualDiscountAmount}`).toBe(expected);
        return this;
    }

    discountAmountGreaterThanOrEqualToZero(): ViewOrderVerification {
        const discountAmount = toNum(this.response.discountAmount);
        expect(discountAmount, `Discount amount should be non-negative, but was: ${discountAmount}`).toBeGreaterThanOrEqual(
            0
        );
        return this;
    }

    appliedCouponCode(expectedCouponCodeAlias: string | null): ViewOrderVerification {
        const expectedCouponCode = this.context.getParamValue(expectedCouponCodeAlias);
        const actualCouponCode = this.response.appliedCouponCode;
        if (expectedCouponCode == null) {
            // null expected — accept both null and undefined from the response
            expect(actualCouponCode == null, `Expected applied coupon code to be null/absent, but was '${actualCouponCode}'`).toBe(true);
        } else {
            expect(actualCouponCode, `Expected applied coupon code to be '${expectedCouponCode}', but was '${actualCouponCode}'`)
                .toBe(expectedCouponCode);
        }
        return this;
    }

    preTaxTotalGreaterThanZero(): ViewOrderVerification {
        const preTaxTotal = this.response.preTaxTotal != null ? toNum(this.response.preTaxTotal) : 0;
        expect(preTaxTotal, `Pre-tax total should be positive, but was: ${preTaxTotal}`).toBeGreaterThan(0);
        return this;
    }

    taxRate(expectedTaxRate: number | string): ViewOrderVerification {
        const expected =
            typeof expectedTaxRate === 'string' ? Converter.toDecimal(expectedTaxRate)!.toNumber() : expectedTaxRate;
        const actualTaxRate = toNum(this.response.taxRate);
        expect(actualTaxRate, `Expected tax rate to be ${expected}, but was ${actualTaxRate}`).toBe(expected);
        return this;
    }

    taxRateGreaterThanOrEqualToZero(): ViewOrderVerification {
        const taxRate = toNum(this.response.taxRate);
        expect(taxRate, `Tax rate should be non-negative, but was: ${taxRate}`).toBeGreaterThanOrEqual(0);
        return this;
    }

    taxAmount(expectedTaxAmount: number | string): ViewOrderVerification {
        const expected =
            typeof expectedTaxAmount === 'string' ? Converter.toDecimal(expectedTaxAmount)!.toNumber() : expectedTaxAmount;
        const actualTaxAmount = toNum(this.response.taxAmount);
        expect(actualTaxAmount, `Expected tax amount to be ${expected}, but was ${actualTaxAmount}`).toBe(expected);
        return this;
    }

    taxAmountGreaterThanOrEqualToZero(): ViewOrderVerification {
        const taxAmount = toNum(this.response.taxAmount);
        expect(taxAmount, `Tax amount should be non-negative, but was: ${taxAmount}`).toBeGreaterThanOrEqual(0);
        return this;
    }

    totalPrice(expectedTotalPrice: number | string): ViewOrderVerification {
        const expected =
            typeof expectedTotalPrice === 'string' ? Converter.toDecimal(expectedTotalPrice)!.toNumber() : expectedTotalPrice;
        const actualTotalPrice = toNum(this.response.totalPrice);
        expect(actualTotalPrice, `Expected total price to be ${expected}, but was ${actualTotalPrice}`).toBe(expected);
        return this;
    }

    totalPriceGreaterThanZero(): ViewOrderVerification {
        const totalPrice = toNum(this.response.totalPrice);
        expect(totalPrice, `Total price should be positive, but was: ${totalPrice}`).toBeGreaterThan(0);
        return this;
    }

    orderNumberHasPrefix(expectedPrefix: string): ViewOrderVerification {
        const actualOrderNumber = this.response.orderNumber;
        expect(
            actualOrderNumber.startsWith(expectedPrefix),
            `Expected order number to start with '${expectedPrefix}', but was: ${actualOrderNumber}`
        ).toBe(true);
        return this;
    }

    orderTimestamp(expectedTimestamp: Date | string): ViewOrderVerification {
        const expected = typeof expectedTimestamp === 'string' ? Converter.toDate(expectedTimestamp) : expectedTimestamp;
        const actualNorm = Converter.normalizeToDate(this.response.orderTimestamp);
        expect(actualNorm?.getTime(), `Expected order timestamp to be ${expected?.toISOString()}`).toBe(expected?.getTime());
        return this;
    }

    orderTimestampIsNotNull(): ViewOrderVerification {
        const actualNorm = Converter.normalizeToDate(this.response.orderTimestamp);
        expect(actualNorm, `Expected order timestamp to be set, but was null`).not.toBeNull();
        expect(actualNorm!.getTime(), `Expected order timestamp to be valid`).not.toBe(NaN);
        return this;
    }

    appliedCouponCodeIsNull(): ViewOrderVerification {
        const actualCouponCode = this.response.appliedCouponCode;
        expect(actualCouponCode, `Expected applied coupon code to be null, but was '${actualCouponCode}'`).toBeNull();
        return this;
    }
}






