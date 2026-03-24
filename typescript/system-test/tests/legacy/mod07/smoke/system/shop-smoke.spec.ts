/**
 * V5 smoke test: UseCaseDsl shop; one test per channel (UI/API).
 */
import '../../../../../setup-config.js';
import { test, forChannels } from '../fixtures.js';
import { ChannelType } from '@optivem/dsl-core/usecase/shop/ChannelType.js';

test.describe('V5 Shop Smoke Tests', () => {
    forChannels(ChannelType.UI, ChannelType.API)(() => {
        test('should be able to go to shop', async ({ useCase }) => {
            (await useCase.shop().goToShop()
                .execute())
                .shouldSucceed();
        });
    });
});
