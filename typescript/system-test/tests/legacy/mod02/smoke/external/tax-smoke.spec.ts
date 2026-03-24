/**
 * V1 smoke test: raw HTTP client for Tax.
 * Uses configuration + fetch; no driver. Setup: setUpExternalHttpClients equivalent.
 */
import '../../../../../setup-config.js';
import { test } from '@playwright/test';
import { testConfig } from '../../../../../src/index.js';

const HEALTH_ENDPOINT = '/health';

test.describe('V1 Tax Smoke Tests', () => {
    test('should be able to go to Tax', async () => {
        const url = testConfig.urls.taxApi + HEALTH_ENDPOINT;
        const response = await fetch(url);
        test.expect(response.status).toBe(200);
    });
});
