import '../../../../setup-config.js';
import { NewOrderPage } from '@optivem/driver-adapter/shop/ui/client/pages/NewOrderPage.js';
import { OrderStatus } from '@optivem/driver-port/shop/dtos/OrderStatus.js';
import { Integer } from '@optivem/commons';
import { GherkinDefaults } from '@optivem/dsl-core/scenario/GherkinDefaults.js';
import { test, expect, createUniqueSku } from './base/fixtures.js';

function decimalToNumber(value: any): number {
    return value?.toNumber();
}

function integerToNumber(value: Integer): number {
    return value?.toNumber();
}

test('should view placed order', async ({ shopUiClient, erpClient }) => {
    const sku = createUniqueSku(GherkinDefaults.DEFAULT_SKU);
    const createProductResult = await erpClient.createProduct({ id: sku, price: '20.00' });
    expect(createProductResult.isSuccess()).toBe(true);

    await shopUiClient.close();
    let homePage = await shopUiClient.openHomePage();
    const newOrderPage = await homePage.clickNewOrder();
    await newOrderPage.inputSku(sku);
    await newOrderPage.inputQuantity('5');
    await newOrderPage.inputCountry(GherkinDefaults.DEFAULT_COUNTRY);
    await newOrderPage.inputCouponCode(null);
    await newOrderPage.clickPlaceOrder();

    const placeOrderResult = await newOrderPage.getResult();
    expect(placeOrderResult.isSuccess()).toBe(true);
    const orderNumber = NewOrderPage.getOrderNumber(placeOrderResult.getValue());

    await shopUiClient.close();
    homePage = await shopUiClient.openHomePage();
    const orderHistoryPage = await homePage.clickOrderHistory();
    await orderHistoryPage.inputOrderNumber(orderNumber);
    await orderHistoryPage.clickSearch();
    const isListed = await orderHistoryPage.waitForOrderRow(orderNumber);
    expect(isListed).toBe(true);
    const orderDetailsPage = await orderHistoryPage.clickViewOrderDetails(orderNumber);
    const isLoaded = await orderDetailsPage.isLoadedSuccessfully();
    expect(isLoaded).toBe(true);

    const orderNumberValue = await orderDetailsPage.getOrderNumber();
    const skuValue = await orderDetailsPage.getSku();
    const countryValue = await orderDetailsPage.getCountry();
    const quantityValue = Integer.fromNumber(await orderDetailsPage.getQuantity());
    const unitPriceValue = await orderDetailsPage.getUnitPrice();
    const subtotalPriceValue = await orderDetailsPage.getSubtotalPrice();
    const statusValue = await orderDetailsPage.getStatus();
    const discountRateValue = await orderDetailsPage.getDiscountRate();
    const discountAmountValue = await orderDetailsPage.getDiscountAmount();
    const taxRateValue = await orderDetailsPage.getTaxRate();
    const taxAmountValue = await orderDetailsPage.getTaxAmount();
    const totalPriceValue = await orderDetailsPage.getTotalPrice();

    expect(orderNumberValue).toBe(orderNumber);
    expect(skuValue).toBe(sku);
    expect(countryValue).toBe(GherkinDefaults.DEFAULT_COUNTRY);
    expect(integerToNumber(quantityValue)).toBe(5);
    expect(decimalToNumber(unitPriceValue)).toBe(20.0);
    expect(decimalToNumber(subtotalPriceValue)).toBe(100.0);
    expect(statusValue).toBe(OrderStatus.PLACED);
    expect(decimalToNumber(discountRateValue)).toBeGreaterThanOrEqual(0);
    expect(decimalToNumber(discountAmountValue)).toBeGreaterThanOrEqual(0);
    expect(decimalToNumber(subtotalPriceValue)).toBeGreaterThan(0);
    expect(decimalToNumber(taxRateValue)).toBeGreaterThanOrEqual(0);
    expect(decimalToNumber(taxAmountValue)).toBeGreaterThanOrEqual(0);
    expect(decimalToNumber(totalPriceValue)).toBeGreaterThan(0);
});
