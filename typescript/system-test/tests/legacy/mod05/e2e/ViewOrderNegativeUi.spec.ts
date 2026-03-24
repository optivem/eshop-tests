import '../../../../setup-config.js';
import { test, expect } from './base/fixtures.js';

const nonExistentOrderCases = [
	{ orderNumber: 'NON-EXISTENT-ORDER-99999', expectedMessage: 'Order NON-EXISTENT-ORDER-99999 does not exist.' },
	{ orderNumber: 'NON-EXISTENT-ORDER-88888', expectedMessage: 'Order NON-EXISTENT-ORDER-88888 does not exist.' },
	{ orderNumber: 'NON-EXISTENT-ORDER-77777', expectedMessage: 'Order NON-EXISTENT-ORDER-77777 does not exist.' },
];

test.each(nonExistentOrderCases)(
	'should not be able to view non-existent order (orderNumber=$orderNumber)',
	async ({ shopUiDriver, orderNumber, expectedMessage }) => {
		const result = await shopUiDriver.viewOrder(orderNumber);
		expect(result).toBeFailureWith(expectedMessage);
	}
);
