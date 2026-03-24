/**
 * V3 smoke test: shop UI driver (driver layer). Extends ShopBaseSmokeTest.
 */
import '../../../../../setup-config.js';
import { test } from '../fixtures.js';
import { ShopUiSmokeTest } from './ShopBaseSmokeTest.js';

test.describe('V3 Shop UI Smoke Tests', () => {
    test('should be able to go to shop', async ({ shopUiDriver }) => {
        const test = new ShopUiSmokeTest(shopUiDriver);
        await test.shouldBeAbleToGoToShop();
    });
});
