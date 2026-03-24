/**
 * V7 Tax Contract Test.
 * Runs for both STUB and REAL external system modes.
 */
import '../../../../setup-config.js';
import { test } from '../base/fixtures.js';

test.describe('Tax Contract Tests', () => {
    test('should be able to get tax rate', async ({ scenario }) => {
        (await scenario
            .given().country().withCode('US').withTaxRate(0.09)
            .then().country('US'))
            .hasTaxRateIsPositive();
    });
});
