/**
 * V7 acceptance: view order (negative).
 */
import '../../../../setup-config.js';
import { test, forChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/usecase/shop/ChannelType.js';

const nonExistentOrderCases = [
    { orderNumber: 'NON-EXISTENT-ORDER-99999', message: 'Order NON-EXISTENT-ORDER-99999 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-88888', message: 'Order NON-EXISTENT-ORDER-88888 does not exist.' },
    { orderNumber: 'NON-EXISTENT-ORDER-77777', message: 'Order NON-EXISTENT-ORDER-77777 does not exist.' },
];

forChannels(ChannelType.UI, ChannelType.API)(() => {
    test.each(nonExistentOrderCases)(
        'should not be able to view non-existent order (orderNumber=$orderNumber)',
        async ({ scenario, orderNumber, message }) => {
            await scenario
                .when().viewOrder()
                    .withOrderNumber(orderNumber)
                .then().shouldFail()
                    .errorMessage(message);
        }
    );
});
