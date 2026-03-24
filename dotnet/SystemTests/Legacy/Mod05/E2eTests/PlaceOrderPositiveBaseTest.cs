using Common;
using Driver.Port.External.Erp.Dtos;
using Driver.Port.Shop.Dtos;
using SystemTests.Commons.Constants;
using SystemTests.Legacy.Mod05.E2eTests.Base;
using Shouldly;
using Xunit;

namespace SystemTests.Legacy.Mod05.E2eTests;

public abstract class PlaceOrderPositiveBaseTest : BaseE2eTest
{
    [Fact]
    public async Task ShouldPlaceOrderWithCorrectSubtotalPrice()
    {
        var sku = CreateUniqueSku(Defaults.SKU);
        (await _erpDriver!.ReturnsProductAsync(new ReturnsProductRequest { Sku = sku, Price = "20.00" })).ShouldBeSuccess();

        var placeOrderRequest = new PlaceOrderRequest { Sku = sku, Quantity = "5", Country = Defaults.COUNTRY };
        var placeOrderResult = await _shopDriver!.PlaceOrderAsync(placeOrderRequest);
        placeOrderResult.ShouldBeSuccess();

        var orderNumber = placeOrderResult.Value.OrderNumber;
        var viewOrderResult = await _shopDriver.ViewOrderAsync(orderNumber);
        viewOrderResult.ShouldBeSuccess();
        viewOrderResult.Value!.SubtotalPrice.ShouldBe(100.00m);
    }

    [Theory]
    [InlineData("20.00", "5", "100.00")]
    [InlineData("10.00", "3", "30.00")]
    [InlineData("15.50", "4", "62.00")]
    [InlineData("99.99", "1", "99.99")]
    public async Task ShouldPlaceOrderWithCorrectSubtotalPriceParameterized(string unitPrice, string quantity, string expectedSubtotalPrice)
    {
        var sku = CreateUniqueSku(Defaults.SKU);
        (await _erpDriver!.ReturnsProductAsync(new ReturnsProductRequest { Sku = sku, Price = unitPrice })).ShouldBeSuccess();

        var placeOrderRequest = new PlaceOrderRequest { Sku = sku, Quantity = quantity, Country = Defaults.COUNTRY };
        var placeOrderResult = await _shopDriver!.PlaceOrderAsync(placeOrderRequest);
        placeOrderResult.ShouldBeSuccess();

        var orderNumber = placeOrderResult.Value.OrderNumber;
        var viewOrderResult = await _shopDriver.ViewOrderAsync(orderNumber);
        viewOrderResult.ShouldBeSuccess();
        viewOrderResult.Value!.SubtotalPrice.ShouldBe(decimal.Parse(expectedSubtotalPrice));
    }

    [Fact]
    public async Task ShouldPlaceOrder()
    {
        var sku = CreateUniqueSku(Defaults.SKU);
        (await _erpDriver!.ReturnsProductAsync(new ReturnsProductRequest { Sku = sku, Price = "20.00" })).ShouldBeSuccess();

        var placeOrderRequest = new PlaceOrderRequest { Sku = sku, Quantity = "5", Country = Defaults.COUNTRY };
        var placeOrderResult = await _shopDriver!.PlaceOrderAsync(placeOrderRequest);
        placeOrderResult.ShouldBeSuccess();

        var orderNumber = placeOrderResult.Value.OrderNumber;
        orderNumber.ShouldStartWith("ORD-");

        var viewOrderResult = await _shopDriver.ViewOrderAsync(orderNumber);
        viewOrderResult.ShouldBeSuccess();

        var order = viewOrderResult.Value!;
        order.OrderNumber.ShouldBe(orderNumber);
        order.Sku.ShouldBe(sku);
        order.Country.ShouldBe(Defaults.COUNTRY);
        order.Quantity.ShouldBe(5);
        order.UnitPrice.ShouldBe(20.00m);
        order.SubtotalPrice.ShouldBe(100.00m);
        order.Status.ShouldBe(OrderStatus.Placed);
        order.DiscountRate.ShouldBeGreaterThanOrEqualTo(0);
        order.DiscountAmount.ShouldBeGreaterThanOrEqualTo(0);
        order.SubtotalPrice.ShouldBeGreaterThan(0);
        order.TaxRate.ShouldBeGreaterThanOrEqualTo(0);
        order.TaxAmount.ShouldBeGreaterThanOrEqualTo(0);
        order.TotalPrice.ShouldBeGreaterThan(0);
    }
}













