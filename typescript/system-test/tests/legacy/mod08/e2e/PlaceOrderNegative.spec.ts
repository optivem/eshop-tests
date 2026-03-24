import '../../../../setup-config.js';
import { test, forChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/usecase/shop/ChannelType.js';
import { emptyArgumentsProvider } from '../shared/argumentProviders.js';

const validationError = 'The request contains one or more validation errors';

forChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should reject order with invalid quantity', async ({ scenario }) => {
        await scenario
            .given().product()
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

    test.each(emptyArgumentsProvider)(
        'should reject order with empty SKU (sku=$sku)',
        async ({ scenario, sku }) => {
            await scenario
                .when().placeOrder()
                    .withSku(sku)
                .then().shouldFail()
                    .errorMessage(validationError)
                    .fieldErrorMessage('sku', 'SKU must not be empty');
        }
    );

    test.each(emptyArgumentsProvider)(
        'should reject order with empty quantity (quantity=$emptyQuantity)',
        async ({ scenario, emptyQuantity }) => {
            await scenario
                .when().placeOrder()
                    .withQuantity(emptyQuantity)
                .then().shouldFail()
                    .errorMessage(validationError)
                    .fieldErrorMessage('quantity', 'Quantity must not be empty');
        }
    );

    test.each(['3.5', 'lala'])(
        'should reject order with non-integer quantity (quantity=$nonIntegerQuantity)',
        async ({ scenario, nonIntegerQuantity }) => {
            await scenario
                .when().placeOrder()
                    .withQuantity(nonIntegerQuantity)
                .then().shouldFail()
                    .errorMessage(validationError)
                    .fieldErrorMessage('quantity', 'Quantity must be an integer');
        }
    );

    test.each(emptyArgumentsProvider)(
        'should reject order with empty country (country=$emptyCountry)',
        async ({ scenario, emptyCountry }) => {
            await scenario
                .when().placeOrder()
                    .withCountry(emptyCountry)
                .then().shouldFail()
                    .errorMessage(validationError)
                    .fieldErrorMessage('country', 'Country must not be empty');
        }
    );

    test('should reject order with invalid country', async ({ scenario }) => {
        await scenario
            .given().product()
            .when().placeOrder()
                .withCountry('XX')
            .then().shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('country', 'Country does not exist: XX');
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
