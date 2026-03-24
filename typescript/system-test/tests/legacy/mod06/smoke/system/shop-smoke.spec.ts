/**
 * V4 smoke test: channel driver (UI and API); one test per channel.
 */
import '../../../../../setup-config.js';
import { test, channelShopDriverTest, expect } from '../fixtures.js';
import { ChannelType } from '@optivem/dsl-core/usecase/shop/ChannelType.js';

test.describe('V4 Shop Smoke Tests', () => {
    channelShopDriverTest(
        [ChannelType.UI, ChannelType.API],
        'should be able to go to shop',
        async ({ shopDriver }) => {
            const result = await shopDriver.goToShop();
            expect(result).toBeSuccess();
        }
    );
});
