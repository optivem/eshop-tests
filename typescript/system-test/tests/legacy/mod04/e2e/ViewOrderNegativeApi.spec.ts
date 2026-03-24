import '../../../../setup-config.js';
import { test, expect } from './base/fixtures.js';

test('should not be able to view non-existent order', async ({ shopApiClient }) => {
    const orderNumber = 'NON-EXISTENT-ORDER-99999';
    const result = await shopApiClient.orders().viewOrder(orderNumber);

    expect(result.isFailure()).toBe(true);
    const error = result.getError();
    expect(error.detail).toBe('Order NON-EXISTENT-ORDER-99999 does not exist.');
});
