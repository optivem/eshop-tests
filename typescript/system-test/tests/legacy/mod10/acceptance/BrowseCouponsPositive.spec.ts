/**
 * V7 acceptance: browse coupons (positive).
 */
import '../../../../setup-config.js';
import { test, forChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/usecase/shop/ChannelType.js';

forChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should be able to browse coupons', async ({ scenario }) => {
        await scenario
            .when().browseCoupons()
            .then().shouldSucceed();
    });
});
