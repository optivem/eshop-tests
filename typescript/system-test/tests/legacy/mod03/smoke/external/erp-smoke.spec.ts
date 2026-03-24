/**
 * V1 smoke test: raw HTTP client for ERP.
 * Uses configuration + fetch; no driver. Setup: setUpExternalHttpClients equivalent.
 */
import '../../../../../setup-config.js';
import { test } from '@playwright/test';
import { testConfig } from '../../../../../src/index.js';

const HEALTH_ENDPOINT = '/health';

test.describe('V1 ERP Smoke Tests', () => {
    test('should be able to go to ERP', async () => {
        const url = testConfig.urls.erpApi + HEALTH_ENDPOINT;
        const response = await fetch(url);
        test.expect(response.status).toBe(200);
    });
});
