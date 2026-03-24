/**
 * V7 acceptance: publish coupon (positive).
 */
import '../../../../setup-config.js';
import { test, forChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/usecase/shop/ChannelType.js';

forChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should be able to publish valid coupon', async ({ scenario }) => {
        await scenario
            .when().publishCoupon()
                .withCouponCode('SUMMER2025')
                .withDiscountRate(0.15)
                .withValidFrom('2024-06-01T00:00:00Z')
                .withValidTo('2024-08-31T23:59:59Z')
                .withUsageLimit(100)
            .then().shouldSucceed();
    });

    test('should be able to publish coupon with empty optional fields', async ({ scenario }) => {
        await scenario
            .when().publishCoupon()
                .withCouponCode('SUMMER2025')
                .withDiscountRate(0.15)
                .withValidFrom('')
                .withValidTo('')
                .withUsageLimit('')
            .then().shouldSucceed();
    });

    test('should be able to correctly save coupon', async ({ scenario }) => {
        await scenario
            .when().publishCoupon()
                .withCouponCode('SUMMER2025')
                .withDiscountRate(0.15)
                .withValidFrom('2024-06-01T00:00:00Z')
                .withValidTo('2024-08-31T23:59:00Z')
                .withUsageLimit(100)
            .then().shouldSucceed()
            .and().coupon('SUMMER2025')
                .hasDiscountRate(0.15)
                .isValidFrom('2024-06-01T00:00:00Z')
                .isValidTo('2024-08-31T23:59:00Z')
                .hasUsageLimit(100)
                .hasUsedCount(0);
    });
});
