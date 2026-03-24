import '../../../../setup-config.js';
import { test, forChannels } from './base/fixtures.js';
import { ChannelType } from '@optivem/dsl-core/usecase/shop/ChannelType.js';
import { GherkinDefaults } from '@optivem/dsl-core/scenario/GherkinDefaults.js';
import { emptyArgumentsProvider } from '../shared/argumentProviders.js';

const validationError = 'The request contains one or more validation errors';

forChannels(ChannelType.UI, ChannelType.API)(() => {
    test('should reject order with invalid quantity', async ({ useCase }) => {
        (await useCase.shop().placeOrder()
            .sku(GherkinDefaults.DEFAULT_SKU)
            .country(GherkinDefaults.DEFAULT_COUNTRY)
            .quantity('invalid-quantity')
            .execute())
            .shouldFail()
            .errorMessage(validationError)
            .fieldErrorMessage('quantity', 'Quantity must be an integer');
    });

    test('should reject order with non-existent SKU', async ({ useCase }) => {
        (await useCase.shop().placeOrder()
            .sku('NON-EXISTENT-SKU-12345')
            .quantity(GherkinDefaults.DEFAULT_QUANTITY)
            .country(GherkinDefaults.DEFAULT_COUNTRY)
            .execute())
            .shouldFail()
            .errorMessage(validationError)
            .fieldErrorMessage('sku', 'Product does not exist for SKU: NON-EXISTENT-SKU-12345');
    });

    test('should reject order with negative quantity', async ({ useCase }) => {
        (await useCase.shop().placeOrder()
            .sku(GherkinDefaults.DEFAULT_SKU)
            .country(GherkinDefaults.DEFAULT_COUNTRY)
            .quantity(-10)
            .execute())
            .shouldFail()
            .errorMessage(validationError)
            .fieldErrorMessage('quantity', 'Quantity must be positive');
    });

    test('should reject order with zero quantity', async ({ useCase }) => {
        (await useCase.shop().placeOrder()
            .sku('ANOTHER-SKU-67890')
            .country(GherkinDefaults.DEFAULT_COUNTRY)
            .quantity(0)
            .execute())
            .shouldFail()
            .errorMessage(validationError)
            .fieldErrorMessage('quantity', 'Quantity must be positive');
    });

    test.each(emptyArgumentsProvider)(
        'should reject order with empty SKU (sku=$sku)',
        async ({ useCase, sku }) => {
            (await useCase.shop().placeOrder()
                .sku(sku)
                .quantity(GherkinDefaults.DEFAULT_QUANTITY)
                .country(GherkinDefaults.DEFAULT_COUNTRY)
                .execute())
                .shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('sku', 'SKU must not be empty');
        }
    );

    test.each(emptyArgumentsProvider)(
        'should reject order with empty quantity (quantity=$emptyQuantity)',
        async ({ useCase, emptyQuantity }) => {
            (await useCase.shop().placeOrder()
                .sku(GherkinDefaults.DEFAULT_SKU)
                .country(GherkinDefaults.DEFAULT_COUNTRY)
                .quantity(emptyQuantity)
                .execute())
                .shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('quantity', 'Quantity must not be empty');
        }
    );

    test.each(['3.5', 'lala'])(
        'should reject order with non-integer quantity (quantity=$nonIntegerQuantity)',
        async ({ useCase, nonIntegerQuantity }) => {
            (await useCase.shop().placeOrder()
                .sku(GherkinDefaults.DEFAULT_SKU)
                .country(GherkinDefaults.DEFAULT_COUNTRY)
                .quantity(nonIntegerQuantity)
                .execute())
                .shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('quantity', 'Quantity must be an integer');
        }
    );

    test.each(emptyArgumentsProvider)(
        'should reject order with empty country (country=$emptyCountry)',
        async ({ useCase, emptyCountry }) => {
            (await useCase.shop().placeOrder()
                .sku(GherkinDefaults.DEFAULT_SKU)
                .quantity(GherkinDefaults.DEFAULT_QUANTITY)
                .country(emptyCountry)
                .execute())
                .shouldFail()
                .errorMessage(validationError)
                .fieldErrorMessage('country', 'Country must not be empty');
        }
    );

    test('should reject order with invalid country', async ({ useCase }) => {
        (await useCase.erp().returnsProduct()
            .sku(GherkinDefaults.DEFAULT_SKU)
            .execute())
            .shouldSucceed();

        (await useCase.shop().placeOrder()
            .sku(GherkinDefaults.DEFAULT_SKU)
            .quantity(GherkinDefaults.DEFAULT_QUANTITY)
            .country('XX')
            .execute())
            .shouldFail()
            .errorMessage(validationError)
            .fieldErrorMessage('country', 'Country does not exist: XX');
    });
});

forChannels(ChannelType.API)(() => {
    test('should reject order with null quantity', async ({ useCase }) => {
        (await useCase.shop().placeOrder()
            .sku(GherkinDefaults.DEFAULT_SKU)
            .country(GherkinDefaults.DEFAULT_COUNTRY)
            .quantity(null)
            .execute())
            .shouldFail()
            .errorMessage(validationError)
            .fieldErrorMessage('quantity', 'Quantity must not be empty');
    });

    test('should reject order with null SKU', async ({ useCase }) => {
        (await useCase.shop().placeOrder()
            .sku(null)
            .quantity(GherkinDefaults.DEFAULT_QUANTITY)
            .country(GherkinDefaults.DEFAULT_COUNTRY)
            .execute())
            .shouldFail()
            .errorMessage(validationError)
            .fieldErrorMessage('sku', 'SKU must not be empty');
    });

    test('should reject order with null country', async ({ useCase }) => {
        (await useCase.shop().placeOrder()
            .sku(GherkinDefaults.DEFAULT_SKU)
            .quantity(GherkinDefaults.DEFAULT_QUANTITY)
            .country(null)
            .execute())
            .shouldFail()
            .errorMessage(validationError)
            .fieldErrorMessage('country', 'Country must not be empty');
    });
});
