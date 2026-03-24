/**
 * V7 acceptance: publish coupon (negative).
 */
import '../../../../setup-config.js';
import { test, forChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/usecase/shop/ChannelType.js';

const validationError = 'The request contains one or more validation errors';

forChannels(ChannelType.UI, ChannelType.API)(() => {
    test.each(['0.0', '-0.01', '-0.15'])('cannot publish coupon with zero or negative discount (discountRate=$discountRate)', async ({ scenario, discountRate }) => {
        await scenario
            .when().publishCoupon()
                .withCouponCode('INVALID-COUPON')
                .withDiscountRate(discountRate)
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('discountRate', 'Discount rate must be greater than 0.00');
    });

    test.each(['1.01', '2.00'])('cannot publish coupon with discount greater than 100 percent (discountRate=$discountRate)', async ({ scenario, discountRate }) => {
        await scenario
            .when().publishCoupon()
                .withCouponCode('INVALID-COUPON')
                .withDiscountRate(discountRate)
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('discountRate', 'Discount rate must be at most 1.00');
    });

    test('cannot publish coupon with duplicate coupon code', async ({ scenario }) => {
        await scenario
            .given().coupon()
                .withCouponCode('EXISTING-COUPON')
                .withDiscountRate(0.1)
            .when().publishCoupon()
                .withCouponCode('EXISTING-COUPON')
                .withDiscountRate(0.2)
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('couponCode', 'Coupon code EXISTING-COUPON already exists');
    });

    test.each(['0', '-1', '-100'])('cannot publish coupon with zero or negative usage limit (usageLimit=$usageLimit)', async ({ scenario, usageLimit }) => {
        await scenario
            .when().publishCoupon()
                .withCouponCode('INVALID-LIMIT')
                .withDiscountRate(0.15)
                .withUsageLimit(usageLimit)
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('usageLimit', 'Usage limit must be positive');
    });
});
