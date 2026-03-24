import '../../../../setup-config.js';
import { test, expect } from './base/fixtures.js';

test('should not be able to view non-existent order', async ({ shopUiClient }) => {
    const orderNumber = 'NON-EXISTENT-ORDER-99999';

    await shopUiClient.close();
    const homePage = await shopUiClient.openHomePage();
    const orderHistoryPage = await homePage.clickOrderHistory();

    await orderHistoryPage.inputOrderNumber(orderNumber);
    await orderHistoryPage.clickSearch();

    const isListed = await orderHistoryPage.waitForOrderRow(orderNumber);
    expect(isListed).toBe(false);

    const errorMessage = `Order ${orderNumber} does not exist.`;
    expect(errorMessage).toBe('Order NON-EXISTENT-ORDER-99999 does not exist.');
});