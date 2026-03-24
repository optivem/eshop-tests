import '../../../../setup-config.js';
import { GherkinDefaults } from '@optivem/dsl-core/scenario/GherkinDefaults.js';
import { test, expect, createUniqueSku } from './base/fixtures.js';
import { testConfig } from '../../../../src/index.js';

const shopApiBaseUrl = testConfig.urls.shopApi;
const erpApiBaseUrl = testConfig.urls.erpApi;

async function createProductViaErp(sku: string, price: string): Promise<void> {
    const response = await fetch(`${erpApiBaseUrl}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: sku,
            title: 'Test Product',
            description: 'Test Description',
            category: 'Test Category',
            brand: 'Test Brand',
            price,
        }),
    });

    expect(response.status).toBe(201);
}

async function placeOrderViaApi(sku: string, quantity: string, country: string): Promise<{ status: number; body: any }> {
    const response = await fetch(`${shopApiBaseUrl}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sku, quantity, country }),
    });

    const body = await response.json();
    return { status: response.status, body };
}

async function viewOrderViaApi(orderId: string): Promise<{ status: number; body: any }> {
    const response = await fetch(`${shopApiBaseUrl}/api/orders/${orderId}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    const body = await response.json();
    return { status: response.status, body };
}

test('should place order with correct subtotal price', async () => {
    const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
    await createProductViaErp(sku, '20.00');

    const placeOrderResult = await placeOrderViaApi(
        sku,
        '5',
        GherkinDefaults.DEFAULT_COUNTRY
    );

    expect(placeOrderResult.status).toBe(201);
    expect(placeOrderResult.body.orderNumber).toBeDefined();

    const viewOrderResult = await viewOrderViaApi(placeOrderResult.body.orderNumber);

    expect(viewOrderResult.status).toBe(200);
    expect(Number(viewOrderResult.body.subtotalPrice)).toBe(100.00);
});

const subtotalPriceCases = [
    { unitPrice: '20.00', quantity: '5', subtotalPrice: '100.00' },
    { unitPrice: '10.00', quantity: '3', subtotalPrice: '30.00' },
    { unitPrice: '15.50', quantity: '4', subtotalPrice: '62.00' },
    { unitPrice: '99.99', quantity: '1', subtotalPrice: '99.99' },
];

test.each(subtotalPriceCases)(
    'should place order with correct subtotal price parameterized (unitPrice=$unitPrice, quantity=$quantity, subtotalPrice=$subtotalPrice)',
    async ({ unitPrice, quantity, subtotalPrice }) => {
        const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
        await createProductViaErp(sku, unitPrice);

        const placeOrderResult = await placeOrderViaApi(
            sku,
            quantity,
            GherkinDefaults.DEFAULT_COUNTRY
        );

        expect(placeOrderResult.status).toBe(201);
        expect(placeOrderResult.body.orderNumber).toBeDefined();

        const viewOrderResult = await viewOrderViaApi(placeOrderResult.body.orderNumber);

        expect(viewOrderResult.status).toBe(200);
        expect(Number(viewOrderResult.body.subtotalPrice)).toBe(Number(subtotalPrice));
    }
);

test('should place order', async () => {
    const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
    await createProductViaErp(sku, '20.00');

    const placeOrderResult = await placeOrderViaApi(
        sku,
        '5',
        GherkinDefaults.DEFAULT_COUNTRY
    );

    expect(placeOrderResult.status).toBe(201);
    expect(placeOrderResult.body.orderNumber).toBeDefined();
    expect(placeOrderResult.body.orderNumber.startsWith('ORD-')).toBe(true);

    const viewOrderResult = await viewOrderViaApi(placeOrderResult.body.orderNumber);

    expect(viewOrderResult.status).toBe(200);
    expect(viewOrderResult.body.orderNumber).toBe(placeOrderResult.body.orderNumber);
    expect(viewOrderResult.body.sku).toBe(sku);
    expect(viewOrderResult.body.country).toBe(GherkinDefaults.DEFAULT_COUNTRY);
    expect(Number(viewOrderResult.body.quantity)).toBe(5);
    expect(Number(viewOrderResult.body.unitPrice)).toBe(20.00);
    expect(Number(viewOrderResult.body.subtotalPrice)).toBe(100.00);
    expect(viewOrderResult.body.status).toBe('PLACED');
    expect(Number(viewOrderResult.body.discountRate)).toBeGreaterThanOrEqual(0);
    expect(Number(viewOrderResult.body.discountAmount)).toBeGreaterThanOrEqual(0);
    expect(Number(viewOrderResult.body.taxRate)).toBeGreaterThanOrEqual(0);
    expect(Number(viewOrderResult.body.taxAmount)).toBeGreaterThanOrEqual(0);
    expect(Number(viewOrderResult.body.totalPrice)).toBeGreaterThan(0);
});