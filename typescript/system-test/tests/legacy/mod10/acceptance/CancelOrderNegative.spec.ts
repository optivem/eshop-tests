/**
 * V7 acceptance: cancel order (negative).
 */
import '../../../../setup-config.js';
import { test, forChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/usecase/shop/ChannelType.js';
import { OrderStatus } from '@optivem/driver-port/shop/dtos/OrderStatus.js';

const nonExistentOrderCases = [
    { orderNumber: 'NON-EXISTENT-ORDER-99999', message: 'Order NON-EXISTENT-ORDER-99999 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-88888', message: 'Order NON-EXISTENT-ORDER-88888 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-77777', message: 'Order NON-EXISTENT-ORDER-77777 does not exist.' },
];

forChannels(ChannelType.API)(() => {
    test.each(nonExistentOrderCases)('should not cancel non-existent order (orderNumber=$orderNumber)', async ({ scenario, orderNumber, message }) => {
        await scenario
            .when().cancelOrder()
                .withOrderNumber(orderNumber)
            .then().shouldFail()
                .errorMessage(message);
    });

    test('should not cancel already cancelled order', async ({ scenario }) => {
        await scenario
            .given().order()
                .withStatus(OrderStatus.CANCELLED)
            .when().cancelOrder()
            .then().shouldFail()
                .errorMessage('Order has already been cancelled');
    });

    test('cannot cancel non-existent order', async ({ scenario }) => {
        await scenario
            .when().cancelOrder()
                .withOrderNumber('non-existent-order-12345')
            .then().shouldFail()
                .errorMessage('Order non-existent-order-12345 does not exist.');
    });
});
