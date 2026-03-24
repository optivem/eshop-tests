/**
 * V5 smoke test: UseCaseDsl Tax.
 */
import '../../../../../setup-config.js';
import { test } from '../fixtures.js';

test.describe('V5 Tax Smoke Tests', () => {
    test('should be able to go to Tax', async ({ useCase }) => {
        (await useCase.tax().goToTax()
            .execute())
            .shouldSucceed();
    });
});
