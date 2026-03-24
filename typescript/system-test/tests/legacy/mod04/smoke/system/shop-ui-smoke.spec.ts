/**
 * V2 smoke test: shop UI client.
 * Uses client layer (ShopUiClient); openHomePage then assert page loaded.
 */
import '../../../../../setup-config.js';
import { test } from '../fixtures.js';

test.describe('V2 Shop UI Smoke Tests', () => {
    test('should be able to go to shop', async ({ shopUiClient }) => {
        await shopUiClient.openHomePage();
        test.expect(await shopUiClient.isPageLoaded()).toBe(true);
    });
});
