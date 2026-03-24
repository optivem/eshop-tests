import '../../../../setup-config.js';
import { test, forChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/usecase/shop/ChannelType.js';
import { OrderStatus } from '@optivem/driver-port/shop/dtos/OrderStatus.js';
import { GherkinDefaults } from '@optivem/dsl-core/scenario/GherkinDefaults.js';

const subtotalPriceCases = [
    { unitPrice: '20.00', quantity: '5', subtotalPrice: '100.00' },
    { unitPrice: '10.00', quantity: '3', subtotalPrice: '30.00' },
    { unitPrice: '15.50', quantity: '4', subtotalPrice: '62.00' },
    { unitPrice: '99.99', quantity: '1', subtotalPrice: '99.99' },
];

forChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should place order with correct subtotal price', async ({ useCase }) => {
        (await useCase.erp().returnsProduct()
            .sku(GherkinDefaults.DEFAULT_SKU)
            .unitPrice(20.0)
            .execute())
            .shouldSucceed();

        (await useCase.shop().placeOrder()
            .orderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
            .sku(GherkinDefaults.DEFAULT_SKU)
            .country(GherkinDefaults.DEFAULT_COUNTRY)
            .quantity(5)
            .execute())
            .shouldSucceed();

        (await useCase.shop().viewOrder()
            .orderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
            .execute())
            .shouldSucceed()
            .subtotalPrice(100.0);
    });

    test.each(subtotalPriceCases)(
        'should place order with correct subtotal price parameterized (unitPrice=$unitPrice, quantity=$quantity, subtotalPrice=$subtotalPrice)',
        async ({ useCase, unitPrice, quantity, subtotalPrice }) => {

            (await useCase.erp().returnsProduct()
                .sku(GherkinDefaults.DEFAULT_SKU)
                .unitPrice(unitPrice)
                .execute())
                .shouldSucceed();

            (await useCase.shop().placeOrder()
                .orderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
                .sku(GherkinDefaults.DEFAULT_SKU)
                .country(GherkinDefaults.DEFAULT_COUNTRY)
                .quantity(quantity)
                .execute())
                .shouldSucceed();

            (await useCase.shop().viewOrder()
                .orderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
                .execute())
                .shouldSucceed()
                .subtotalPrice(subtotalPrice);
        }
    );

    test('should place order', async ({ useCase }) => {
        (await useCase.erp().returnsProduct()
            .sku(GherkinDefaults.DEFAULT_SKU)
            .unitPrice(20.0)
            .execute())
            .shouldSucceed();

        (await useCase.shop().placeOrder()
            .orderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
            .sku(GherkinDefaults.DEFAULT_SKU)
            .country(GherkinDefaults.DEFAULT_COUNTRY)
            .quantity(5)
            .execute())
            .shouldSucceed()
            .orderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
            .orderNumberStartsWith('ORD-');

        (await useCase.shop().viewOrder()
            .orderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
            .execute())
            .shouldSucceed()
            .orderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
            .sku(GherkinDefaults.DEFAULT_SKU)
            .country(GherkinDefaults.DEFAULT_COUNTRY)
            .quantity(5)
            .unitPrice(20.0)
            .subtotalPrice(100.0)
            .status(OrderStatus.PLACED)
            .discountRateGreaterThanOrEqualToZero()
            .discountAmountGreaterThanOrEqualToZero()
            .subtotalPriceGreaterThanZero()
            .taxRateGreaterThanOrEqualToZero()
            .taxAmountGreaterThanOrEqualToZero()
            .totalPriceGreaterThanZero();
    });
});

