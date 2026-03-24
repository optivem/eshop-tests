/**
 * V6 smoke test: UseCaseDsl ERP (BaseSystemDslTest).
 */
import '../../../../../setup-config.js';
import { test } from '../fixtures.js';

test.describe('V6 ERP Smoke Tests', () => {
    test('should be able to go to ERP', async ({ scenario }) => {
        await scenario.assume().erp().shouldBeRunning();
    });
});
