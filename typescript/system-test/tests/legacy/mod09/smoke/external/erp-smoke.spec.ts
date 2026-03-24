/** V7 smoke test: UseCaseDsl ERP. */
import '../../../../../setup-config.js';
import { test } from '../fixtures.js';

test.describe('V7 External – ERP', () => {
    test('should be able to go to ERP', async ({ scenario }) => {
        await scenario.assume().erp().shouldBeRunning();
    });
});
