import '../../../../setup-config.js';
import { OrderStatus } from '@optivem/driver-port/shop/dtos/OrderStatus.js';
import { GherkinDefaults } from '@optivem/dsl-core/scenario/GherkinDefaults.js';
import { test, expect, createUniqueSku } from './base/fixtures.js';

test('should place order with correct subtotal price', async ({ shopUiDriver, erpDriver }) => {
    const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
    expect(await erpDriver.returnsProduct({ sku, price: '20.00' })).toBeSuccess();

    const placeOrderResult = await shopUiDriver.placeOrder({ sku, quantity: '5', country: GherkinDefaults.DEFAULT_COUNTRY });
    expect(placeOrderResult).toBeSuccess();

    const orderNumber = placeOrderResult.getValue().orderNumber;
    const viewOrderResult = await shopUiDriver.viewOrder(orderNumber);
    expect(viewOrderResult).toBeSuccess();
    expect(viewOrderResult.getValue().subtotalPrice).toEqualDecimal(100.0);
});

const subtotalPriceCases = [
    { unitPrice: '20.00', quantity: '5', subtotalPrice: '100.00' },
    { unitPrice: '10.00', quantity: '3', subtotalPrice: '30.00' },
    { unitPrice: '15.50', quantity: '4', subtotalPrice: '62.00' },
    { unitPrice: '99.99', quantity: '1', subtotalPrice: '99.99' },
];

test.each(subtotalPriceCases)(
    'should place order with correct subtotal price parameterized (unitPrice=$unitPrice, quantity=$quantity, subtotalPrice=$subtotalPrice)',
    async ({ shopUiDriver, erpDriver, unitPrice, quantity, subtotalPrice }) => {
        const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
        expect(await erpDriver.returnsProduct({ sku, price: unitPrice })).toBeSuccess();

        const placeOrderResult = await shopUiDriver.placeOrder({ sku, quantity, country: GherkinDefaults.DEFAULT_COUNTRY });
        expect(placeOrderResult).toBeSuccess();

        const orderNumber = placeOrderResult.getValue().orderNumber;
        const viewOrderResult = await shopUiDriver.viewOrder(orderNumber);
        expect(viewOrderResult).toBeSuccess();
        expect(viewOrderResult.getValue().subtotalPrice).toEqualDecimal(subtotalPrice);
    }
);

test('should place order', async ({ shopUiDriver, erpDriver }) => {
    const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
    expect(await erpDriver.returnsProduct({ sku, price: '20.00' })).toBeSuccess();

    const placeOrderResult = await shopUiDriver.placeOrder({ sku, quantity: '5', country: GherkinDefaults.DEFAULT_COUNTRY });
    expect(placeOrderResult).toBeSuccess();

    const orderNumber = placeOrderResult.getValue().orderNumber;
    expect(orderNumber.startsWith('ORD-')).toBe(true);

    const viewOrderResult = await shopUiDriver.viewOrder(orderNumber);
    expect(viewOrderResult).toBeSuccess();

    const order = viewOrderResult.getValue();
    expect(order.orderNumber).toBe(orderNumber);
    expect(order.sku).toBe(sku);
    expect(order.country).toBe(GherkinDefaults.DEFAULT_COUNTRY);
    expect(order.quantity).toEqualInteger(5);
    expect(order.unitPrice).toEqualDecimal(20.0);
    expect(order.subtotalPrice).toEqualDecimal(100.0);
    expect(order.status).toBe(OrderStatus.PLACED);
    expect(order.discountRate).toBeGreaterThanOrEqualDecimal(0);
    expect(order.discountAmount).toBeGreaterThanOrEqualDecimal(0);
    expect(order.subtotalPrice).toBeGreaterThanDecimal(0);
    expect(order.taxRate).toBeGreaterThanOrEqualDecimal(0);
    expect(order.taxAmount).toBeGreaterThanOrEqualDecimal(0);
    expect(order.totalPrice).toBeGreaterThanDecimal(0);
});

