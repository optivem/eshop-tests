/**
 * V3 smoke test: external ERP (driver layer).
 */
import '../../../../../setup-config.js';
import { test } from '../fixtures.js';

test.describe('V3 ERP Smoke Tests', () => {
    test('should be able to go to ERP', async ({ erpDriver }) => {
        const result = await erpDriver.goToErp();
        test.expect(result).toBeSuccess();
    });
});
