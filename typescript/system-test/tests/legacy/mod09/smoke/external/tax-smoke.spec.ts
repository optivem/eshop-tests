/** V7 smoke test: UseCaseDsl tax. */
import '../../../../../setup-config.js';
import { test } from '../fixtures.js';

test.describe('V7 External – Tax', () => {
    test('should be able to go to tax', async ({ scenario }) => {
        await scenario.assume().tax().shouldBeRunning();
    });
});
