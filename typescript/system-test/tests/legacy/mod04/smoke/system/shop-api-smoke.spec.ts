/**
 * V2 smoke test: shop API client.
 * Uses client layer (ShopApiClient); health check.
 */
import '../../../../../setup-config.js';
import { test } from '../fixtures.js';

test.describe('V2 Shop API Smoke Tests', () => {
    test('should be able to go to shop', async ({ shopApiClient }) => {
        const result = await shopApiClient.health().checkHealth();
        test.expect(result).toBeSuccess();
    });
});
