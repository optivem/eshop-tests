/**
 * V6 smoke test: scenario-based shop (BaseScenarioDslTest); one test per channel.
 */
import '../../../../../setup-config.js';
import { test, forChannels } from '../fixtures.js';
import { ChannelType } from '@optivem/dsl-core/usecase/shop/ChannelType.js';

forChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should be able to go to shop', async ({ scenario }) => {
        await scenario.assume().shop().shouldBeRunning();
    });
});
