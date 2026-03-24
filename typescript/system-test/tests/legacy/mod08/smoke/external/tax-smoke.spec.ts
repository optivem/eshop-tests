/**
 * V6 smoke test: UseCaseDsl Tax (BaseSystemDslTest).
 */
import '../../../../../setup-config.js';
import { test } from '../fixtures.js';

test.describe('V6 Tax Smoke Tests', () => {
    test('should be able to go to Tax', async ({ scenario }) => {
        await scenario.assume().tax().shouldBeRunning();
    });
});
