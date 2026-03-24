import '../../../../setup-config.js';
import { GherkinDefaults } from '@optivem/dsl-core/scenario/GherkinDefaults.js';
import { emptyArgumentsProvider } from '../shared/argumentProviders.js';
import { test, expect, createUniqueSku } from './base/fixtures.js';

const validationError = 'The request contains one or more validation errors';

test('should reject order with invalid quantity', async ({ shopApiDriver }) => {
	const result = await shopApiDriver.placeOrder({
		sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
		quantity: 'invalid-quantity',
		country: GherkinDefaults.DEFAULT_COUNTRY,
	});

	expect(result).toHaveErrorMessage(validationError);
	expect(result).toHaveFieldError('Quantity must be an integer');
});

test('should reject order with non-existent SKU', async ({ shopApiDriver }) => {
	const result = await shopApiDriver.placeOrder({
		sku: 'NON-EXISTENT-SKU-12345',
		quantity: GherkinDefaults.DEFAULT_QUANTITY,
		country: GherkinDefaults.DEFAULT_COUNTRY,
	});

	expect(result).toHaveErrorMessage(validationError);
	expect(result).toHaveFieldError('Product does not exist for SKU: NON-EXISTENT-SKU-12345');
});

test('should reject order with negative quantity', async ({ shopApiDriver }) => {
	const result = await shopApiDriver.placeOrder({
		sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
		quantity: '-10',
		country: GherkinDefaults.DEFAULT_COUNTRY,
	});

	expect(result).toHaveErrorMessage(validationError);
	expect(result).toHaveFieldError('Quantity must be positive');
});

test('should reject order with zero quantity', async ({ shopApiDriver }) => {
	const result = await shopApiDriver.placeOrder({
		sku: 'ANOTHER-SKU-67890',
		quantity: '0',
		country: GherkinDefaults.DEFAULT_COUNTRY,
	});

	expect(result).toHaveErrorMessage(validationError);
	expect(result).toHaveFieldError('Quantity must be positive');
});

test.each(emptyArgumentsProvider)('should reject order with empty SKU (sku=$sku)', async ({ shopApiDriver, sku }) => {
	const result = await shopApiDriver.placeOrder({
		sku,
		quantity: GherkinDefaults.DEFAULT_QUANTITY,
		country: GherkinDefaults.DEFAULT_COUNTRY,
	});

	expect(result).toHaveErrorMessage(validationError);
	expect(result).toHaveFieldError('SKU must not be empty');
});

test.each(emptyArgumentsProvider)('should reject order with empty quantity (quantity=$emptyQuantity)', async ({ shopApiDriver, emptyQuantity }) => {
	const result = await shopApiDriver.placeOrder({
		sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
		quantity: emptyQuantity,
		country: GherkinDefaults.DEFAULT_COUNTRY,
	});

	expect(result).toHaveErrorMessage(validationError);
	expect(result).toHaveFieldError('Quantity must not be empty');
});

test.each(['3.5', 'lala'])('should reject order with non-integer quantity (quantity=$nonIntegerQuantity)', async ({ shopApiDriver, nonIntegerQuantity }) => {
	const result = await shopApiDriver.placeOrder({
		sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
		quantity: nonIntegerQuantity,
		country: GherkinDefaults.DEFAULT_COUNTRY,
	});

	expect(result).toHaveErrorMessage(validationError);
	expect(result).toHaveFieldError('Quantity must be an integer');
});

test.each(emptyArgumentsProvider)('should reject order with empty country (country=$emptyCountry)', async ({ shopApiDriver, emptyCountry }) => {
	const result = await shopApiDriver.placeOrder({
		sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
		quantity: GherkinDefaults.DEFAULT_QUANTITY,
		country: emptyCountry,
	});

	expect(result).toHaveErrorMessage(validationError);
	expect(result).toHaveFieldError('Country must not be empty');
});

test('should reject order with invalid country', async ({ shopApiDriver, erpDriver }) => {
	const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
	expect(await erpDriver.returnsProduct({ sku, price: '20.00' })).toBeSuccess();

	const result = await shopApiDriver.placeOrder({
		sku,
		quantity: GherkinDefaults.DEFAULT_QUANTITY,
		country: 'XX',
	});

	expect(result).toHaveErrorMessage(validationError);
	expect(result).toHaveFieldError('Country does not exist: XX');
});

test('should reject order with null quantity', async ({ shopApiDriver }) => {
	const result = await shopApiDriver.placeOrder({
		sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
		quantity: null,
		country: GherkinDefaults.DEFAULT_COUNTRY,
	});
	expect(result).toHaveErrorMessage(validationError);
	expect(result).toHaveFieldError('Quantity must not be empty');
});

test('should reject order with null SKU', async ({ shopApiDriver }) => {
	const result = await shopApiDriver.placeOrder({
		sku: null,
		quantity: GherkinDefaults.DEFAULT_QUANTITY,
		country: GherkinDefaults.DEFAULT_COUNTRY,
	});
	expect(result).toHaveErrorMessage(validationError);
	expect(result).toHaveFieldError('SKU must not be empty');
});

test('should reject order with null country', async ({ shopApiDriver }) => {
	const result = await shopApiDriver.placeOrder({
		sku: createUniqueSku(GherkinDefaults.DEFAULT_SKU),
		quantity: GherkinDefaults.DEFAULT_QUANTITY,
		country: null,
	});
	expect(result).toHaveErrorMessage(validationError);
	expect(result).toHaveFieldError('Country must not be empty');
});
