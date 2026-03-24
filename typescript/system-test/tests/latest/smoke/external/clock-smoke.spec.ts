/** V7 smoke test: UseCaseDsl clock. */
import '../../../../setup-config.js';
import { test } from '../fixtures.js';

test.describe('V7 External – Clock', () => {
    test('should be able to go to clock', async ({ scenario }) => {
        await scenario.assume().clock().shouldBeRunning();
    });
});
