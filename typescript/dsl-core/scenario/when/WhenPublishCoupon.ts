import { VoidVerification } from '@optivem/dsl-core/shared';
import { Converter } from '@optivem/commons';
import type { Optional } from '@optivem/commons';
import type { UseCaseDsl } from '../../usecase/UseCaseDsl.js';
import { ExecutionResult } from '../ExecutionResult.js';
import { ExecutionResultBuilder } from '../ExecutionResultBuilder.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseWhenBuilder } from './BaseWhenStep.js';

export class PublishCouponBuilder extends BaseWhenBuilder<void, VoidVerification> {
    private couponCodeValue: Optional<string>;
    private discountRateValue: Optional<string>;
    private validFromValue: Optional<string>;
    private validToValue: Optional<string>;
    private usageLimitValue: Optional<string>;

    constructor(app: UseCaseDsl, setup?: () => Promise<void>) {
        super(app, setup);
        this.withCouponCode(GherkinDefaults.DEFAULT_COUPON_CODE);
        this.withDiscountRate(GherkinDefaults.DEFAULT_DISCOUNT_RATE);
    }

    withCouponCode(couponCode: Optional<string>): this {
        this.couponCodeValue = couponCode;
        return this;
    }

    withDiscountRate(discountRate: Optional<string>): this;
    withDiscountRate(discountRate: number): this;
    withDiscountRate(discountRate: Optional<string> | number): this {
        this.discountRateValue = typeof discountRate === 'number' ? Converter.fromDouble(discountRate) : discountRate;
        return this;
    }

    withValidFrom(validFrom: Optional<string>): this {
        this.validFromValue = validFrom;
        return this;
    }

    withValidTo(validTo: Optional<string>): this {
        this.validToValue = validTo;
        return this;
    }

    withUsageLimit(usageLimit: Optional<string>): this;
    withUsageLimit(usageLimit: number): this;
    withUsageLimit(usageLimit: Optional<string> | number): this {
        this.usageLimitValue = typeof usageLimit === 'number' ? String(usageLimit) : usageLimit;
        return this;
    }

    protected override async execute(
        app: UseCaseDsl
    ): Promise<ExecutionResult<void, VoidVerification>> {
        const result = await app
            .shop()
            .publishCoupon()
            .couponCode(this.couponCodeValue)
            .discountRate(this.discountRateValue)
            .validFrom(this.validFromValue)
            .validTo(this.validToValue)
            .usageLimit(this.usageLimitValue)
            .execute();

        return new ExecutionResultBuilder(result)
            .couponCode(this.couponCodeValue)
            .build();
    }
}


