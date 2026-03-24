import '../../../../setup-config.js';
import { GherkinDefaults } from '@optivem/dsl-core/scenario/GherkinDefaults.js';
import { test, expect, createUniqueSku } from './base/fixtures.js';
import { testConfig } from '../../../../src/index.js';

const validationError = 'The request contains one or more validation errors';
const shopApiBaseUrl = testConfig.urls.shopApi;
const erpApiBaseUrl = testConfig.urls.erpApi;

function assertValidationError(status: number, body: any, field: string, message: string): void {
    expect(status).toBe(422);
    expect(body.detail).toBe(validationError);

    const found = Array.isArray(body.errors) && body.errors.some(
        (error: any) => error.field === field && error.message === message
    );

    expect(found).toBe(true);
}

test('should reject order with invalid quantity', async () => {
    const placeOrderJson = `{"sku":"${createUniqueSku(GherkinDefaults.DEFAULT_SKU)}","quantity":"invalid-quantity","country":"${GherkinDefaults.DEFAULT_COUNTRY}"}`;

    const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: placeOrderJson,
    });

    const body = await response.json();

    assertValidationError(response.status, body, 'quantity', 'Quantity must be an integer');
});

test('should reject order with non-existent SKU', async () => {
    const placeOrderJson = `{"sku":"NON-EXISTENT-SKU-12345","quantity":"${GherkinDefaults.DEFAULT_QUANTITY}","country":"${GherkinDefaults.DEFAULT_COUNTRY}"}`;

    const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: placeOrderJson,
    });

    const body = await response.json();

    assertValidationError(response.status, body, 'sku', 'Product does not exist for SKU: NON-EXISTENT-SKU-12345');
});

test('should reject order with negative quantity', async () => {
    const placeOrderJson = `{"sku":"${createUniqueSku(GherkinDefaults.DEFAULT_SKU)}","quantity":"-10","country":"${GherkinDefaults.DEFAULT_COUNTRY}"}`;

    const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: placeOrderJson,
    });

    const body = await response.json();

    assertValidationError(response.status, body, 'quantity', 'Quantity must be positive');
});

test('should reject order with zero quantity', async () => {
    const placeOrderJson = `{"sku":"${createUniqueSku(GherkinDefaults.DEFAULT_SKU)}","quantity":"0","country":"${GherkinDefaults.DEFAULT_COUNTRY}"}`;

    const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: placeOrderJson,
    });

    const body = await response.json();

    assertValidationError(response.status, body, 'quantity', 'Quantity must be positive');
});

test('should reject order with empty SKU', async () => {
    const placeOrderJson = `{"sku":"","quantity":"${GherkinDefaults.DEFAULT_QUANTITY}","country":"${GherkinDefaults.DEFAULT_COUNTRY}"}`;

    const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: placeOrderJson,
    });

    const body = await response.json();

    assertValidationError(response.status, body, 'sku', 'SKU must not be empty');
});

test('should reject order with empty quantity', async () => {
    const placeOrderJson = `{"sku":"${createUniqueSku(GherkinDefaults.DEFAULT_SKU)}","quantity":"","country":"${GherkinDefaults.DEFAULT_COUNTRY}"}`;

    const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: placeOrderJson,
    });

    const body = await response.json();

    assertValidationError(response.status, body, 'quantity', 'Quantity must not be empty');
});

test('should reject order with quantity as single space', async () => {
    const placeOrderJson = `{"sku":"${createUniqueSku(GherkinDefaults.DEFAULT_SKU)}","quantity":" ","country":"${GherkinDefaults.DEFAULT_COUNTRY}"}`;

    const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: placeOrderJson,
    });

    const body = await response.json();

    assertValidationError(response.status, body, 'quantity', 'Quantity must not be empty');
});

test('should reject order with quantity as double space', async () => {
    const placeOrderJson = `{"sku":"${createUniqueSku(GherkinDefaults.DEFAULT_SKU)}","quantity":"  ","country":"${GherkinDefaults.DEFAULT_COUNTRY}"}`;

    const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: placeOrderJson,
    });

    const body = await response.json();

    assertValidationError(response.status, body, 'quantity', 'Quantity must not be empty');
});

test('should reject order with non-integer quantity 3.5', async () => {
    const placeOrderJson = `{"sku":"${createUniqueSku(GherkinDefaults.DEFAULT_SKU)}","quantity":"3.5","country":"${GherkinDefaults.DEFAULT_COUNTRY}"}`;

    const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: placeOrderJson,
    });

    const body = await response.json();

    assertValidationError(response.status, body, 'quantity', 'Quantity must be an integer');
});

test('should reject order with non-integer quantity lala', async () => {
    const placeOrderJson = `{"sku":"${createUniqueSku(GherkinDefaults.DEFAULT_SKU)}","quantity":"lala","country":"${GherkinDefaults.DEFAULT_COUNTRY}"}`;

    const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: placeOrderJson,
    });

    const body = await response.json();

    assertValidationError(response.status, body, 'quantity', 'Quantity must be an integer');
});

test('should reject order with empty country', async () => {
    const placeOrderJson = `{"sku":"${createUniqueSku(GherkinDefaults.DEFAULT_SKU)}","quantity":"${GherkinDefaults.DEFAULT_QUANTITY}","country":""}`;

    const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: placeOrderJson,
    });

    const body = await response.json();

    assertValidationError(response.status, body, 'country', 'Country must not be empty');
});

test('should reject order with invalid country', async () => {
    const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);

    const createProductJson = `{"id":"${sku}","title":"Test Product","description":"Test Description","category":"Test Category","brand":"Test Brand","price":"20.00"}`;
    const createProductResponse = await fetch(`${erpApiBaseUrl}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: createProductJson,
    });
    expect(createProductResponse.status).toBe(201);

    const placeOrderJson = `{"sku":"${sku}","quantity":"${GherkinDefaults.DEFAULT_QUANTITY}","country":"XX"}`;
    const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: placeOrderJson,
    });

    const body = await response.json();

    assertValidationError(response.status, body, 'country', 'Country does not exist: XX');
});
