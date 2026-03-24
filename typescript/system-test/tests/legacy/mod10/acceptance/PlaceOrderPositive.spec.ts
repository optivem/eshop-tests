/**
 * V7 acceptance: place order (positive).
 */
import '../../../../setup-config.js';
import { test, forChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/usecase/shop/ChannelType.js';
import { OrderStatus } from '@optivem/driver-port/shop/dtos/OrderStatus.js';

forChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should be able to place order for valid input', async ({ scenario }) => {
        await scenario
            .given().product()
                .withSku('ABC')
                .withUnitPrice(20)
            .and().country()
                .withCode('US')
                .withTaxRate(0.1)
            .when().placeOrder()
                .withSku('ABC')
                .withQuantity(5)
                .withCountry('US')
            .then().shouldSucceed();
    });

    test('order status should be placed after placing order', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
            .then().shouldSucceed()
            .and().order()
                .hasStatus(OrderStatus.PLACED);
    });

    test('should calculate base price as product of unit price and quantity', async ({ scenario }) => {
        await scenario
            .given().product()
                .withUnitPrice(20)
            .when().placeOrder()
                .withQuantity(5)
            .then().shouldSucceed()
            .and().order()
                .hasBasePrice(100);
    });

    const basePriceCases = [
        { unitPrice: '20.00', quantity: '5', basePrice: '100.00' },
        { unitPrice: '10.00', quantity: '3', basePrice: '30.00' },
        { unitPrice: '15.50', quantity: '4', basePrice: '62.00' },
        { unitPrice: '99.99', quantity: '1', basePrice: '99.99' },
    ];

    test.each(basePriceCases)(
        'should place order with correct base price parameterized (unitPrice=$unitPrice, quantity=$quantity, basePrice=$basePrice)',
        async ({ scenario, unitPrice, quantity, basePrice }) => {
            await scenario
                .given().product()
                    .withUnitPrice(unitPrice)
                .when().placeOrder()
                    .withQuantity(quantity)
                .then().shouldSucceed()
                .and().order()
                    .hasBasePrice(basePrice);
        }
    );

    test('order prefix should be ORD', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
            .then().shouldSucceed()
            .and().order()
                .hasOrderNumberPrefix('ORD-');
    });

    test('discount rate should be applied for coupon', async ({ scenario }) => {
        await scenario
            .given().coupon()
                .withCouponCode('SUMMER2025')
                .withDiscountRate(0.15)
            .when().placeOrder()
                .withCouponCode('SUMMER2025')
            .then().shouldSucceed()
            .and().order()
                .hasAppliedCoupon('SUMMER2025')
                .hasDiscountRate(0.15);
    });

    test('discount rate should not be applied when there is no coupon', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
                .withCouponCode(null)
            .then().shouldSucceed()
            .and().order()
                .hasAppliedCoupon(null)
                .hasDiscountRate(0)
                .hasDiscountAmount(0);
    });

    test('subtotal price should be calculated as the base price minus discount amount when we have coupon', async ({ scenario }) => {
        await scenario
            .given().coupon()
                .withDiscountRate(0.15)
            .and().product()
                .withUnitPrice(20)
            .when().placeOrder()
                .withCouponCode()
                .withQuantity(5)
            .then().shouldSucceed()
            .and().order()
                .hasAppliedCoupon()
                .hasDiscountRate(0.15)
                .hasBasePrice(100)
                .hasDiscountAmount(15)
                .hasSubtotalPrice(85);
    });

    test('subtotal price should be same as base price when no coupon', async ({ scenario }) => {
        await scenario
            .given().product()
                .withUnitPrice(20)
            .when().placeOrder()
                .withQuantity(5)
            .then().shouldSucceed()
            .and().order()
                .hasBasePrice(100)
                .hasDiscountAmount(0)
                .hasSubtotalPrice(100);
    });

    const taxRateCases = [
        { country: 'UK', taxRate: '0.09' },
        { country: 'US', taxRate: '0.20' },
    ];

    test.each(taxRateCases)(
        'correct tax rate should be used based on country (country=$country, taxRate=$taxRate)',
        async ({ scenario, country, taxRate }) => {
            await scenario
                .given().country()
                    .withCode(country)
                    .withTaxRate(taxRate)
                .when().placeOrder()
                    .withCountry(country)
                .then().shouldSucceed()
                .and().order()
                    .hasTaxRate(taxRate);
        }
    );

    const totalPriceCases = [
        { country: 'UK', taxRate: '0.09', subtotalPrice: '50.00', expectedTaxAmount: '4.50', expectedTotalPrice: '54.50' },
        { country: 'US', taxRate: '0.20', subtotalPrice: '100.00', expectedTaxAmount: '20.00', expectedTotalPrice: '120.00' },
    ];

    test.each(totalPriceCases)(
        'total price should be subtotal price plus tax amount (country=$country, taxRate=$taxRate, subtotalPrice=$subtotalPrice, expectedTaxAmount=$expectedTaxAmount, expectedTotalPrice=$expectedTotalPrice)',
        async ({ scenario, country, taxRate, subtotalPrice, expectedTaxAmount, expectedTotalPrice }) => {
            await scenario
                .given().country()
                    .withCode(country)
                    .withTaxRate(taxRate)
                .and().product()
                    .withUnitPrice(subtotalPrice)
                .when().placeOrder()
                    .withCountry(country)
                    .withQuantity(1)
                .then().shouldSucceed()
                .and().order()
                    .hasTaxRate(taxRate)
                    .hasSubtotalPrice(subtotalPrice)
                    .hasTaxAmount(expectedTaxAmount)
                    .hasTotalPrice(expectedTotalPrice);
        }
    );

    test('coupon usage count has been incremented after its been used', async ({ scenario }) => {
        await scenario
            .given().coupon()
                .withCouponCode('SUMMER2025')
            .when().placeOrder()
                .withCouponCode('SUMMER2025')
            .then().shouldSucceed()
            .and().coupon('SUMMER2025')
                .hasUsedCount(1);
    });
});
