import '../../../../setup-config.js';
import { OrderStatus } from '@optivem/driver-port/shop/dtos/OrderStatus.js';
import { GherkinDefaults } from '@optivem/dsl-core/scenario/GherkinDefaults.js';
import { test, expect, createUniqueSku } from './base/fixtures.js';

function decimalToNumber(value: any): number {
    return value?.toNumber();
}

function integerToNumber(value: any): number {
    return value?.toNumber();
}

test('should place order with correct subtotal price', async ({ shopApiClient, erpClient }) => {
    const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
    const createProductResult = await erpClient.createProduct({ id: sku, price: '20.00' });
    expect(createProductResult.isSuccess()).toBe(true);

    const placeOrderResult = await shopApiClient.orders().placeOrder({ sku, quantity: '5', country: GherkinDefaults.DEFAULT_COUNTRY });
    expect(placeOrderResult.isSuccess()).toBe(true);

    const orderNumber = placeOrderResult.getValue().orderNumber;
    const viewOrderResult = await shopApiClient.orders().viewOrder(orderNumber);
    expect(viewOrderResult.isSuccess()).toBe(true);
    expect(decimalToNumber(viewOrderResult.getValue().subtotalPrice)).toBe(100.0);
});

const subtotalPriceCases = [
    { unitPrice: '20.00', quantity: '5', subtotalPrice: '100.00' },
    { unitPrice: '10.00', quantity: '3', subtotalPrice: '30.00' },
    { unitPrice: '15.50', quantity: '4', subtotalPrice: '62.00' },
    { unitPrice: '99.99', quantity: '1', subtotalPrice: '99.99' },
];

test.each(subtotalPriceCases)(
    'should place order with correct subtotal price parameterized (unitPrice=$unitPrice, quantity=$quantity, subtotalPrice=$subtotalPrice)',
    async ({ shopApiClient, erpClient, unitPrice, quantity, subtotalPrice }) => {
        const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
        const createProductResult = await erpClient.createProduct({ id: sku, price: unitPrice });
        expect(createProductResult.isSuccess()).toBe(true);

        const placeOrderResult = await shopApiClient.orders().placeOrder({ sku, quantity, country: GherkinDefaults.DEFAULT_COUNTRY });
        expect(placeOrderResult.isSuccess()).toBe(true);

        const orderNumber = placeOrderResult.getValue().orderNumber;
        const viewOrderResult = await shopApiClient.orders().viewOrder(orderNumber);
        expect(viewOrderResult.isSuccess()).toBe(true);
        expect(decimalToNumber(viewOrderResult.getValue().subtotalPrice)).toBe(Number(subtotalPrice));
    }
);

test('should place order', async ({ shopApiClient, erpClient }) => {
    const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
    const createProductResult = await erpClient.createProduct({ id: sku, price: '20.00' });
    expect(createProductResult.isSuccess()).toBe(true);

    const placeOrderResult = await shopApiClient.orders().placeOrder({ sku, quantity: '5', country: GherkinDefaults.DEFAULT_COUNTRY });
    expect(placeOrderResult.isSuccess()).toBe(true);

    const orderNumber = placeOrderResult.getValue().orderNumber;
    expect(orderNumber.startsWith('ORD-')).toBe(true);

    const viewOrderResult = await shopApiClient.orders().viewOrder(orderNumber);
    expect(viewOrderResult.isSuccess()).toBe(true);

    const order = viewOrderResult.getValue();
    expect(order.orderNumber).toBe(orderNumber);
    expect(order.sku).toBe(sku);
    expect(order.country).toBe(GherkinDefaults.DEFAULT_COUNTRY);
    expect(integerToNumber(order.quantity)).toBe(5);
    expect(decimalToNumber(order.unitPrice)).toBe(20.0);
    expect(decimalToNumber(order.subtotalPrice)).toBe(100.0);
    expect(order.status).toBe(OrderStatus.PLACED);
    expect(decimalToNumber(order.discountRate)).toBeGreaterThanOrEqual(0);
    expect(decimalToNumber(order.discountAmount)).toBeGreaterThanOrEqual(0);
    expect(decimalToNumber(order.subtotalPrice)).toBeGreaterThan(0);
    expect(decimalToNumber(order.taxRate)).toBeGreaterThanOrEqual(0);
    expect(decimalToNumber(order.taxAmount)).toBeGreaterThanOrEqual(0);
    expect(decimalToNumber(order.totalPrice)).toBeGreaterThan(0);
});

