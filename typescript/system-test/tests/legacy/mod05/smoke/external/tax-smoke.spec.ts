/**
 * V3 smoke test: external Tax (driver layer).
 */
import '../../../../../setup-config.js';
import { test } from '../fixtures.js';

test.describe('V3 Tax Smoke Tests', () => {
    test('should be able to go to Tax', async ({ taxDriver }) => {
        const result = await taxDriver.goToTax();
        test.expect(result).toBeSuccess();
    });
});
