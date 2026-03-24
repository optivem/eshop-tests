import '../../../../setup-config.js';
import { GherkinDefaults } from '@optivem/dsl-core/scenario/GherkinDefaults.js';
import { emptyArgumentsProvider } from '../shared/argumentProviders.js';
import { test, expect, createUniqueSku } from './base/fixtures.js';

const validationError = 'The request contains one or more validation errors';

function assertValidationError(result: any, field: string, message: string): void {
    expect(result.isFailure()).toBe(true);
    const error = result.getError();
    expect(error.message).toBe(validationError);
    expect(error.fields?.some((item: any) => item.field === field && item.message === message)).toBe(true);
}

test('should reject order with invalid quantity', async ({ shopUiClient }) => {
    await shopUiClient.close();
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickNewOrder();

    await newOrderPage.inputSku(createUniqueSku(GherkinDefaults.DEFAULT_SKU));
    await newOrderPage.inputQuantity('invalid-quantity');
    await newOrderPage.inputCountry(GherkinDefaults.DEFAULT_COUNTRY);
    await newOrderPage.inputCouponCode(null);
    await newOrderPage.clickPlaceOrder();

    const result = await newOrderPage.getResult();
    assertValidationError(result, 'quantity', 'Quantity must be an integer');
});

test('should reject order with non-existent SKU', async ({ shopUiClient }) => {
    await shopUiClient.close();
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickNewOrder();

    await newOrderPage.inputSku('NON-EXISTENT-SKU-12345');
    await newOrderPage.inputQuantity(GherkinDefaults.DEFAULT_QUANTITY);
    await newOrderPage.inputCountry(GherkinDefaults.DEFAULT_COUNTRY);
    await newOrderPage.inputCouponCode(null);
    await newOrderPage.clickPlaceOrder();

    const result = await newOrderPage.getResult();
    assertValidationError(result, 'sku', 'Product does not exist for SKU: NON-EXISTENT-SKU-12345');
});

test('should reject order with negative quantity', async ({ shopUiClient }) => {
    await shopUiClient.close();
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickNewOrder();

    await newOrderPage.inputSku(createUniqueSku(GherkinDefaults.DEFAULT_SKU));
    await newOrderPage.inputQuantity('-10');
    await newOrderPage.inputCountry(GherkinDefaults.DEFAULT_COUNTRY);
    await newOrderPage.inputCouponCode(null);
    await newOrderPage.clickPlaceOrder();

    const result = await newOrderPage.getResult();
    assertValidationError(result, 'quantity', 'Quantity must be positive');
});

test('should reject order with zero quantity', async ({ shopUiClient }) => {
    await shopUiClient.close();
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickNewOrder();

    await newOrderPage.inputSku(createUniqueSku(GherkinDefaults.DEFAULT_SKU));
    await newOrderPage.inputQuantity('0');
    await newOrderPage.inputCountry(GherkinDefaults.DEFAULT_COUNTRY);
    await newOrderPage.inputCouponCode(null);
    await newOrderPage.clickPlaceOrder();

    const result = await newOrderPage.getResult();
    assertValidationError(result, 'quantity', 'Quantity must be positive');
});

test.each(emptyArgumentsProvider)('should reject order with empty SKU (sku=$sku)', async ({ shopUiClient, sku }) => {
    await shopUiClient.close();
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickNewOrder();

    await newOrderPage.inputSku(sku);
    await newOrderPage.inputQuantity(GherkinDefaults.DEFAULT_QUANTITY);
    await newOrderPage.inputCountry(GherkinDefaults.DEFAULT_COUNTRY);
    await newOrderPage.inputCouponCode(null);
    await newOrderPage.clickPlaceOrder();

    const result = await newOrderPage.getResult();
    assertValidationError(result, 'sku', 'SKU must not be empty');
});

test.each(emptyArgumentsProvider)('should reject order with empty quantity (quantity=$emptyQuantity)', async ({ shopUiClient, emptyQuantity }) => {
    await shopUiClient.close();
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickNewOrder();

    await newOrderPage.inputSku(createUniqueSku(GherkinDefaults.DEFAULT_SKU));
    await newOrderPage.inputQuantity(emptyQuantity);
    await newOrderPage.inputCountry(GherkinDefaults.DEFAULT_COUNTRY);
    await newOrderPage.inputCouponCode(null);
    await newOrderPage.clickPlaceOrder();

    const result = await newOrderPage.getResult();
    assertValidationError(result, 'quantity', 'Quantity must not be empty');
});

test.each(['3.5', 'lala'])('should reject order with non-integer quantity (quantity=$nonIntegerQuantity)', async ({ shopUiClient, nonIntegerQuantity }) => {
    await shopUiClient.close();
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickNewOrder();

    await newOrderPage.inputSku(createUniqueSku(GherkinDefaults.DEFAULT_SKU));
    await newOrderPage.inputQuantity(nonIntegerQuantity);
    await newOrderPage.inputCountry(GherkinDefaults.DEFAULT_COUNTRY);
    await newOrderPage.inputCouponCode(null);
    await newOrderPage.clickPlaceOrder();

    const result = await newOrderPage.getResult();
    assertValidationError(result, 'quantity', 'Quantity must be an integer');
});

test.each(emptyArgumentsProvider)('should reject order with empty country (country=$emptyCountry)', async ({ shopUiClient, emptyCountry }) => {
    await shopUiClient.close();
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickNewOrder();

    await newOrderPage.inputSku(createUniqueSku(GherkinDefaults.DEFAULT_SKU));
    await newOrderPage.inputQuantity(GherkinDefaults.DEFAULT_QUANTITY);
    await newOrderPage.inputCountry(emptyCountry);
    await newOrderPage.inputCouponCode(null);
    await newOrderPage.clickPlaceOrder();

    const result = await newOrderPage.getResult();
    assertValidationError(result, 'country', 'Country must not be empty');
});

test('should reject order with invalid country', async ({ shopUiClient, erpClient }) => {
    const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
    const createProductResult = await erpClient.createProduct({ id: sku, price: '20.00' });
    expect(createProductResult.isSuccess()).toBe(true);

    await shopUiClient.close();
    const homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickNewOrder();

    await newOrderPage.inputSku(sku);
    await newOrderPage.inputQuantity(GherkinDefaults.DEFAULT_QUANTITY);
    await newOrderPage.inputCountry('XX');
    await newOrderPage.inputCouponCode(null);
    await newOrderPage.clickPlaceOrder();

    const result = await newOrderPage.getResult();
    assertValidationError(result, 'country', 'Country does not exist: XX');
});