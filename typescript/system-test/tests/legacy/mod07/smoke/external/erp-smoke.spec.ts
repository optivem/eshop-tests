/**
 * V5 smoke test: UseCaseDsl ERP.
 */
import '../../../../../setup-config.js';
import { test } from '../fixtures.js';

test.describe('V5 ERP Smoke Tests', () => {
    test('should be able to go to ERP', async ({ useCase }) => {
        (await useCase.erp().goToErp()
            .execute())
            .shouldSucceed();
    });
});
