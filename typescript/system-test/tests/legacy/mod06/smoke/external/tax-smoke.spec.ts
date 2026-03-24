/**
 * V4 smoke test: external Tax (channel driver test base).
 */
import '../../../../../setup-config.js';
import { test, expect } from '../fixtures.js';

test.describe('V4 Tax Smoke Tests', () => {
    test('should be able to go to Tax', async ({ taxDriver }) => {
        const result = await taxDriver.goToTax();
        expect(result).toBeSuccess();
    });
});
