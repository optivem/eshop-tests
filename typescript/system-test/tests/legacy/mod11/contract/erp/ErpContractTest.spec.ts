/**
 * V7 ERP Contract Test.
 * Runs for both STUB and REAL external system modes.
 */
import '../../../../../setup-config.js';
import { test } from '../base/fixtures.js';

test.describe('ERP Contract Tests', () => {
    test('should be able to get product', async ({ scenario }) => {
        (await scenario
            .given().product().withSku('SKU-123').withUnitPrice(12.0)
            .then().product('SKU-123'))
            .hasSku('SKU-123')
            .hasPrice(12.0);
    });
});
