/**
 * V4 smoke test: external ERP (channel driver test base).
 */
import '../../../../../setup-config.js';
import { test, expect } from '../fixtures.js';

test.describe('V4 ERP Smoke Tests', () => {
    test('should be able to go to ERP', async ({ erpDriver }) => {
        const result = await erpDriver.goToErp();
        expect(result).toBeSuccess();
    });
});
