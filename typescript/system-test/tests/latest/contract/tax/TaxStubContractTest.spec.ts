/**
 * V7 Tax Stub Contract Test.
 * Stub-only: verifies that the stub returns the configured tax rate exactly.
 * Skipped when EXTERNAL_SYSTEM_MODE is not STUB.
 */
import '../../../../setup-config.js';
import { ExternalSystemMode } from '@optivem/dsl-port/ExternalSystemMode.js';
import { test } from '../base/fixtures.js';
import { getExternalSystemMode } from '../../../../src/index.js';

test.describe('Tax Stub Contract Tests', () => {
    test.skip(
        () => getExternalSystemMode() !== ExternalSystemMode.STUB,
        'Stub-only tests — skipped when EXTERNAL_SYSTEM_MODE is not STUB'
    );

    test('should be able to get configured tax rate', async ({ scenario }) => {
        (await scenario
            .given().country().withCode('LALA').withTaxRate(0.23)
            .then().country('LALA'))
            .hasCountry('LALA')
            .hasTaxRate(0.23);
    });
});

