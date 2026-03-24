import { ShopDriver } from '@optivem/driver-adapter/shop/ShopDriver.js';
import { BaseShopCommand } from './base/BaseShopCommand.js';
import { ShopUseCaseResult } from './base/ShopUseCaseResult.js';
import { UseCaseContext } from '@optivem/dsl-core/shared';
import { VoidVerification } from '@optivem/dsl-core/shared';
import type { Optional } from '@optivem/commons';
import type { PublishCouponRequest } from '../commons/dtos/index.js';

export class PublishCoupon extends BaseShopCommand<void, VoidVerification> {
    private couponCodeParamAlias: Optional<string>;
    private discountRateValue: Optional<string>;
    private validFromValue: Optional<string>;
    private validToValue: Optional<string>;
    private usageLimitValue: Optional<string>;

    constructor(driver: ShopDriver, context: UseCaseContext) {
        super(driver, context);
    }

    couponCode(couponCodeParamAlias: Optional<string>): PublishCoupon {
        this.couponCodeParamAlias = couponCodeParamAlias;
        return this;
    }

    discountRate(discountRate: number): PublishCoupon;
    discountRate(discountRate: string): PublishCoupon;
    discountRate(discountRate: Optional<string>): PublishCoupon;
    discountRate(discountRate: Optional<number | string>): PublishCoupon {
        this.discountRateValue = discountRate === undefined || discountRate === null ? undefined : typeof discountRate === 'number' ? String(discountRate) : discountRate;
        return this;
    }

    validFrom(validFrom: Optional<string>): PublishCoupon {
        this.validFromValue = validFrom;
        return this;
    }

    validTo(validTo: Optional<string>): PublishCoupon {
        this.validToValue = validTo;
        return this;
    }

    usageLimit(usageLimit: Optional<string>): PublishCoupon {
        this.usageLimitValue = usageLimit;
        return this;
    }

    async execute(): Promise<ShopUseCaseResult<void, VoidVerification>> {
        const couponCode = this.context.getParamValue(this.couponCodeParamAlias);
        const request: PublishCouponRequest = {
            code: couponCode,
            discountRate: this.discountRateValue,
            validFrom: this.validFromValue,
            validTo: this.validToValue,
            usageLimit: this.usageLimitValue,
        };
        const result = await this.driver.publishCoupon(request);
        return new ShopUseCaseResult(result, this.context, (_r, ctx) => new VoidVerification(undefined, ctx));
    }
}





