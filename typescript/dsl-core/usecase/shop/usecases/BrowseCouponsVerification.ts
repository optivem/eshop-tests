import { ResponseVerification, UseCaseContext } from '@optivem/dsl-core/shared';
import { Converter } from '@optivem/commons';
import type { BrowseCouponsResponse, CouponDto } from '../commons/dtos/index.js';
import { expect } from '@playwright/test';

export class BrowseCouponsVerification extends ResponseVerification<BrowseCouponsResponse> {
    constructor(response: BrowseCouponsResponse, context: UseCaseContext) {
        super(response, context);
    }

    hasCouponWithCode(couponCodeAlias: string): BrowseCouponsVerification {
        this.findCouponByCode(couponCodeAlias);
        return this;
    }

    couponHasDiscountRate(couponCodeAlias: string, expectedDiscountRate: number): BrowseCouponsVerification {
        const coupon = this.findCouponByCode(couponCodeAlias);
        const discountRateValue = coupon.discountRate as unknown;
        const actualDiscountRate =
            discountRateValue != null && typeof discountRateValue === 'object' && 'toNumber' in discountRateValue
                ? (discountRateValue as { toNumber: () => number }).toNumber()
                : Number(discountRateValue);

        expect(
            actualDiscountRate,
            `Discount rate for coupon '${couponCodeAlias}'`
        ).toBeCloseTo(expectedDiscountRate, 10);
        return this;
    }

    couponHasValidFrom(couponCodeAlias: string, expectedValidFrom: string): BrowseCouponsVerification {
        const coupon = this.findCouponByCode(couponCodeAlias);
        const expected = Converter.toDate(expectedValidFrom);
        const actual = Converter.normalizeToDate(coupon.validFrom);
        expect(
            actual?.getTime(),
            `ValidFrom for coupon '${couponCodeAlias}'`
        ).toBe(expected?.getTime());
        return this;
    }

    couponHasValidTo(couponCodeAlias: string, expectedValidTo: string): BrowseCouponsVerification {
        const coupon = this.findCouponByCode(couponCodeAlias);
        const expected = Converter.toDate(expectedValidTo);
        const actual = Converter.normalizeToDate(coupon.validTo);
        expect(
            actual?.getTime(),
            `ValidTo for coupon '${couponCodeAlias}'`
        ).toBe(expected?.getTime());
        return this;
    }

    couponHasUsageLimit(couponCodeAlias: string, expectedUsageLimit: number): BrowseCouponsVerification {
        const coupon = this.findCouponByCode(couponCodeAlias);
        const actual = coupon.usageLimit?.toNumber();
        expect(actual, `Usage limit for coupon '${couponCodeAlias}'`).toBe(expectedUsageLimit);
        return this;
    }

    couponHasUsedCount(couponCodeAlias: string, expectedUsedCount: number): BrowseCouponsVerification {
        const coupon = this.findCouponByCode(couponCodeAlias);
        const actual = coupon.usedCount?.toNumber();
        expect(actual, `Used count for coupon '${couponCodeAlias}'`).toBe(expectedUsedCount);
        return this;
    }

    private findCouponByCode(couponCodeAlias: string): CouponDto {
        const couponCode = this.context.getParamValue(couponCodeAlias);
        const coupons = this.response.coupons ?? [];
        const coupon = coupons.find((c) => c.code === couponCode);
        expect(
            coupon,
            `Coupon with code '${couponCode}' not found. Available coupons: ${coupons.map((c) => c.code).join(', ')}`
        ).toBeDefined();
        return coupon!;
    }
}




