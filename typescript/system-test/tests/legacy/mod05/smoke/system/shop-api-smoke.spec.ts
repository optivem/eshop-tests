/**
 * V3 smoke test: shop API driver (driver layer). Extends ShopBaseSmokeTest.
 */
import '../../../../../setup-config.js';
import { test } from '../fixtures.js';
import { ShopApiSmokeTest } from './ShopBaseSmokeTest.js';

test.describe('V3 Shop API Smoke Tests', () => {
    test('should be able to go to shop', async ({ shopApiDriver }) => {
        const test = new ShopApiSmokeTest(shopApiDriver);
        await test.shouldBeAbleToGoToShop();
    });
});
