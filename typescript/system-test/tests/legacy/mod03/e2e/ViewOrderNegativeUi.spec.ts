import '../../../../setup-config.js';
import { test, expect } from './base/fixtures.js';

test('should not be able to view non-existent order', async ({ shopUiDriver }) => {
    const orderNumber = 'NON-EXISTENT-ORDER-99999';
    const result = await shopUiDriver.viewOrder(orderNumber);
    expect(result).toBeFailureWith('Order NON-EXISTENT-ORDER-99999 does not exist.');
});
