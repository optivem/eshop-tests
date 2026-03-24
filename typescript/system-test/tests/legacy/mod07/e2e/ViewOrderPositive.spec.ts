import '../../../../setup-config.js';
import { test, forChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/usecase/shop/ChannelType.js';
import { OrderStatus } from '@optivem/driver-port/shop/dtos/OrderStatus.js';
import { GherkinDefaults } from '@optivem/dsl-core/scenario/GherkinDefaults.js';

forChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should view placed order', async ({ useCase }) => {
        (await useCase.erp().returnsProduct()
            .sku(GherkinDefaults.DEFAULT_SKU)
            .unitPrice(25.0)
            .execute())
            .shouldSucceed();

        (await useCase.shop().placeOrder()
            .orderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
            .sku(GherkinDefaults.DEFAULT_SKU)
            .country(GherkinDefaults.DEFAULT_COUNTRY)
            .quantity(4)
            .execute())
            .shouldSucceed();

        (await useCase.shop().viewOrder()
            .orderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
            .execute())
            .shouldSucceed()
            .orderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
            .sku(GherkinDefaults.DEFAULT_SKU)
            .country(GherkinDefaults.DEFAULT_COUNTRY)
            .quantity(4)
            .unitPrice(25.0)
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

