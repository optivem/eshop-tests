/**
 * V2 smoke test: external Tax (client layer).
 */
import '../../../../../setup-config.js';
import { test } from '../fixtures.js';

test.describe('V2 Tax Smoke Tests', () => {
    test('should be able to go to Tax', async ({ taxClient }) => {
        const result = await taxClient.checkHealth();
        test.expect(result).toBeSuccess();
    });
});
