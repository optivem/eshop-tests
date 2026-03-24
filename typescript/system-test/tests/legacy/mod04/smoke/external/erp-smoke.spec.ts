/**
 * V2 smoke test: external ERP (client layer).
 */
import '../../../../../setup-config.js';
import { test } from '../fixtures.js';

test.describe('V2 ERP Smoke Tests', () => {
    test('should be able to go to ERP', async ({ erpClient }) => {
        const result = await erpClient.checkHealth();
        test.expect(result).toBeSuccess();
    });
});
