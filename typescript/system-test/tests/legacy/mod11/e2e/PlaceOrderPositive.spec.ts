/**
 * V7 e2e: place order (positive). Single scenario matching reference v7 e2e.
 * Runs with getExternalSystemMode() (REAL or STUB).
 */
import '../../../../setup-config.js';
import { test, forChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/usecase/shop/ChannelType.js';

forChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should place order', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
            .then().shouldSucceed();
    });
});
