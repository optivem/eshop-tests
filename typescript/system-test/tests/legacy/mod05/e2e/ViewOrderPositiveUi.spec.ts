import '../../../../setup-config.js';
import { OrderStatus } from '@optivem/driver-port/shop/dtos/OrderStatus.js';
import { GherkinDefaults } from '@optivem/dsl-core/scenario/GherkinDefaults.js';
import { test, expect, createUniqueSku } from './base/fixtures.js';

test('should view placed order', async ({ shopUiDriver, erpDriver }) => {
	const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
	expect(await erpDriver.returnsProduct({ sku, price: '25.00' })).toBeSuccess();

	const placeOrderResult = await shopUiDriver.placeOrder({ sku, quantity: '4', country: GherkinDefaults.DEFAULT_COUNTRY });
	expect(placeOrderResult).toBeSuccess();

	const orderNumber = placeOrderResult.getValue().orderNumber;
	const viewOrderResult = await shopUiDriver.viewOrder(orderNumber);
	expect(viewOrderResult).toBeSuccess();

	const order = viewOrderResult.getValue();
	expect(order.orderNumber).toBe(orderNumber);
	expect(order.sku).toBe(sku);
	expect(order.country).toBe(GherkinDefaults.DEFAULT_COUNTRY);
	expect(order.quantity).toEqualInteger(4);
	expect(order.unitPrice).toEqualDecimal(25.0);
	expect(order.subtotalPrice).toEqualDecimal(100.0);
	expect(order.status).toBe(OrderStatus.PLACED);
	expect(order.discountRate).toBeGreaterThanOrEqualDecimal(0);
	expect(order.discountAmount).toBeGreaterThanOrEqualDecimal(0);
	expect(order.subtotalPrice).toBeGreaterThanDecimal(0);
	expect(order.taxRate).toBeGreaterThanOrEqualDecimal(0);
	expect(order.taxAmount).toBeGreaterThanOrEqualDecimal(0);
	expect(order.totalPrice).toBeGreaterThanDecimal(0);
});

