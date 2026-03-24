/**
 * V7 acceptance: place order (negative).
 */
import '../../../setup-config.js';
import { test, forChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/usecase/shop/ChannelType.js';
import { emptyArgumentsProvider } from '../../commons/providers/argumentProviders.js';

const validationError = 'The request contains one or more validation errors';

forChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should reject order with invalid quantity', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
                .withQuantity('invalid-quantity')
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('quantity', 'Quantity must be an integer');
    });

    test('should reject order with non-existent SKU', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
                .withSku('NON-EXISTENT-SKU-12345')
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('sku', 'Product does not exist for SKU: NON-EXISTENT-SKU-12345');
    });

    test('should reject order with negative quantity', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
                .withQuantity(-10)
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('quantity', 'Quantity must be positive');
    });

    test('should reject order with zero quantity', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
                .withQuantity(0)
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('quantity', 'Quantity must be positive');
    });

    test.each(emptyArgumentsProvider)('should reject order with empty SKU (sku=$sku)', async ({ scenario, sku }) => {
        await scenario
            .when().placeOrder()
                .withSku(sku)
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('sku', 'SKU must not be empty');
    });

    test.each(emptyArgumentsProvider)('should reject order with empty quantity (quantity=$quantity)', async ({ scenario, quantity }) => {
        await scenario
            .when().placeOrder()
                .withQuantity(quantity)
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('quantity', 'Quantity must not be empty');
    });

    test.each(['3.5', 'lala'])('should reject order with non-integer quantity (quantity=$quantity)', async ({ scenario, quantity }) => {
        await scenario
            .when().placeOrder()
                .withQuantity(quantity)
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('quantity', 'Quantity must be an integer');
    });

    test.each(emptyArgumentsProvider)('should reject order with empty country (country=$country)', async ({ scenario, country }) => {
        await scenario
            .when().placeOrder()
                .withCountry(country)
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('country', 'Country must not be empty');
    });

    test('should reject order with invalid country', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
                .withCountry('XX')
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('country', 'Country does not exist: XX');
    });

    test('cannot place order with non-existent coupon', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
                .withCouponCode('INVALIDCOUPON')
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('couponCode', 'Coupon code INVALIDCOUPON does not exist');
    });

    test('cannot place order with coupon that has exceeded usage limit', async ({ scenario }) => {
        await scenario
            .given().coupon()
                .withCouponCode('LIMITED2024')
                .withUsageLimit(2)
            .and().order()
                .withOrderNumber('ORD-1')
                .withCouponCode('LIMITED2024')
            .and().order()
                .withOrderNumber('ORD-2')
                .withCouponCode('LIMITED2024')
            .when().placeOrder()
                .withOrderNumber('ORD-3')
                .withCouponCode('LIMITED2024')
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('couponCode', 'Coupon code LIMITED2024 has exceeded its usage limit');
    });
});

forChannels(ChannelType.API)(() => {
    test('should reject order with null quantity', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
                .withQuantity(null)
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('quantity', 'Quantity must not be empty');
    });

    test('should reject order with null SKU', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
                .withSku(null)
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('sku', 'SKU must not be empty');
    });

    test('should reject order with null country', async ({ scenario }) => {
        await scenario
            .when().placeOrder()
                .withCountry(null)
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('country', 'Country must not be empty');
    });
});
