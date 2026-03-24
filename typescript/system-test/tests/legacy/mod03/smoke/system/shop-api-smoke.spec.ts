/**
 * V1 smoke test: raw HTTP client.
 * Uses configuration + fetch; no driver. Setup: setUpShopHttpClient equivalent (config + fetch).
 */
import '../../../../../setup-config.js';
import { test } from '@playwright/test';
import { testConfig } from '../../../../../src/index.js';

const HEALTH_ENDPOINT = '/health';

test.describe('V1 Shop API Smoke Tests', () => {
    test('should be able to go to shop', async () => {
        const url = testConfig.urls.shopApi + HEALTH_ENDPOINT;
        const response = await fetch(url);
        test.expect(response.status).toBe(200);
    });
});
