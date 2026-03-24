import '../../../../setup-config.js';
import { test, forChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/usecase/shop/ChannelType.js';
import { OrderStatus } from '@optivem/driver-port/shop/dtos/OrderStatus.js';
import { GherkinDefaults } from '../../../../dsl-core/scenario/GherkinDefaults.js';

forChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should view placed order', async ({ scenario }) => {
    await scenario
        .given().product()
            .withSku(GherkinDefaults.DEFAULT_SKU)
            .withUnitPrice(25.0)
        .and().order()
            .withOrderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
            .withSku(GherkinDefaults.DEFAULT_SKU)
            .withCountry(GherkinDefaults.DEFAULT_COUNTRY)
            .withQuantity(4)
        .when().viewOrder()
            .withOrderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER)
        .then().shouldSucceed()
        .and().order(GherkinDefaults.DEFAULT_ORDER_NUMBER)
            .hasSku(GherkinDefaults.DEFAULT_SKU)
            .hasQuantity(4)
            .hasCountry(GherkinDefaults.DEFAULT_COUNTRY)
            .hasUnitPrice(25.0)
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

