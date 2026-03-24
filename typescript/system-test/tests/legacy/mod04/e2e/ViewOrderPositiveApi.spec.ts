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

test('should view placed order', async ({ shopApiClient, erpClient }) => {
    const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
    const createProductResult = await erpClient.createProduct({ id: sku, price: '20.00' });
    expect(createProductResult.isSuccess()).toBe(true);

    const placeOrderResult = await shopApiClient.orders().placeOrder({ sku, quantity: '5', country: GherkinDefaults.DEFAULT_COUNTRY });
    expect(placeOrderResult.isSuccess()).toBe(true);

    const orderNumber = placeOrderResult.getValue().orderNumber;
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

