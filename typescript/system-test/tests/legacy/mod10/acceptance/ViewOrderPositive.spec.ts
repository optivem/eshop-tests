/**
 * V7 acceptance: view order (positive).
 */
import '../../../../setup-config.js';
import { test, forChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/usecase/shop/ChannelType.js';

forChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should be able to view order', async ({ scenario }) => {
        await scenario
            .given().order()
            .when().viewOrder()
            .then().shouldSucceed();
    });
});
