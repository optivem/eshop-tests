/**
 * V7 acceptance: place order (negative, isolated).
 * Uses clock stubbing to simulate time-dependent expiry logic.
 * Isolated tests run sequentially (serial mode) to avoid clock state conflicts.
 */
import '../../../setup-config.js';
import { test, forChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/usecase/shop/ChannelType.js';

test.describe.configure({ mode: 'serial' });

test.describe('@isolated', () => {
    forChannels(ChannelType.UI, ChannelType.API)(() => {
        test('cannot place order with expired coupon', async ({ scenario }) => {
            await scenario
                .given().clock()
                    .withTime('2023-09-01T12:00:00Z')
                .and().coupon()
                    .withCouponCode('SUMMER2023')
                    .withValidFrom('2023-06-01T00:00:00Z')
                    .withValidTo('2023-08-31T23:59:59Z')
                .when().placeOrder()
                    .withCouponCode('SUMMER2023')
                .then().shouldFail()
                    .errorMessage('The request contains one or more validation errors')
                    .fieldErrorMessage('couponCode', 'Coupon code SUMMER2023 has expired');
        });
    });
});
