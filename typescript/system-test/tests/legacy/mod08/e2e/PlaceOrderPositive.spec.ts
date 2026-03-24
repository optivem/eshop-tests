import '../../../../setup-config.js';
import { test, forChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/usecase/shop/ChannelType.js';
import { OrderStatus } from '@optivem/driver-port/shop/dtos/OrderStatus.js';

const subtotalPriceCases = [
    { unitPrice: '20.00', quantity: '5', subtotalPrice: '100.00' },
    { unitPrice: '10.00', quantity: '3', subtotalPrice: '30.00' },
    { unitPrice: '15.50', quantity: '4', subtotalPrice: '62.00' },
    { unitPrice: '99.99', quantity: '1', subtotalPrice: '99.99' },
];

forChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should place order with correct subtotal price', async ({ scenario }) => {
        await scenario
            .given().product()
                .withUnitPrice(20.0)
            .when().placeOrder()
                .withQuantity(5)
            .then().shouldSucceed()
            .and().order()
                .hasSubtotalPrice(100.0);
    });

    test.each(subtotalPriceCases)(
        'should place order with correct subtotal price parameterized (unitPrice=$unitPrice, quantity=$quantity, subtotalPrice=$subtotalPrice)',
        async ({ scenario, unitPrice, quantity, subtotalPrice }) => {
            await scenario
                .given().product()
                    .withUnitPrice(unitPrice)
                .when().placeOrder()
                    .withQuantity(quantity)
                .then().shouldSucceed()
                .and().order()
                    .hasSubtotalPrice(subtotalPrice);
        }
    );

    test('should place order', async ({ scenario }) => {
        await scenario
            .given().product()
                .withUnitPrice(20.0)
            .when().placeOrder()
                .withQuantity(5)
            .then().shouldSucceed()
            .and().order()
                .hasOrderNumberPrefix('ORD-')
                .hasQuantity(5)
                .hasUnitPrice(20.0)
                .hasSubtotalPrice(100.0)
                .hasStatus(OrderStatus.PLACED)
                .hasDiscountRateGreaterThanOrEqualToZero()
                .hasDiscountAmountGreaterThanOrEqualToZero()
                .hasSubtotalPriceGreaterThanZero()
                .hasTaxRateGreaterThanOrEqualToZero()
                .hasTaxAmountGreaterThanOrEqualToZero()
                .hasTotalPriceGreaterThanZero();
    });
});

