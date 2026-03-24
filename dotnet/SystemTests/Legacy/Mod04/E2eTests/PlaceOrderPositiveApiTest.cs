using Common;
using Driver.Adapter.External.Erp.Client.Dtos;
using Driver.Port.Shop.Dtos;
using SystemTests.Commons.Constants;
using SystemTests.Legacy.Mod04.E2eTests.Base;
using SystemTests.Legacy.Mod04.Base;
using Shouldly;
using Xunit;

namespace SystemTests.Legacy.Mod04.E2eTests;

public class PlaceOrderPositiveApiTest : BaseE2eTest
{
    protected override Task SetShopClientAsync()
    {
        SetUpShopApiClient();
        return Task.CompletedTask;
    }

    [Fact]
    public async Task ShouldPlaceOrderWithCorrectSubtotalPrice()
    {
        var sku = CreateUniqueSku(Defaults.SKU);
        (await _erpClient!.CreateProductAsync(new ExtCreateProductRequest { Id = sku, Title = "Test Product", Description = "Test Description", Category = "Test Category", Brand = "Test Brand", Price = "20.00" })).ShouldBeSuccess();

        var placeOrderRequest = new PlaceOrderRequest { Sku = sku, Quantity = "5", Country = Defaults.COUNTRY };
        var placeOrderResult = await _shopApiClient!.Orders().PlaceOrderAsync(placeOrderRequest);
        placeOrderResult.ShouldBeSuccess();

        var orderNumber = placeOrderResult.Value!.OrderNumber;
        var viewOrderResult = await _shopApiClient.Orders().ViewOrderAsync(orderNumber);
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
        (await _erpClient!.CreateProductAsync(new ExtCreateProductRequest { Id = sku, Title = "Test Product", Description = "Test Description", Category = "Test Category", Brand = "Test Brand", Price = unitPrice })).ShouldBeSuccess();

        var placeOrderRequest = new PlaceOrderRequest { Sku = sku, Quantity = quantity, Country = Defaults.COUNTRY };
        var placeOrderResult = await _shopApiClient!.Orders().PlaceOrderAsync(placeOrderRequest);
        placeOrderResult.ShouldBeSuccess();

        var orderNumber = placeOrderResult.Value!.OrderNumber;
        var viewOrderResult = await _shopApiClient.Orders().ViewOrderAsync(orderNumber);
        viewOrderResult.ShouldBeSuccess();
        viewOrderResult.Value!.SubtotalPrice.ShouldBe(decimal.Parse(expectedSubtotalPrice));
    }

    [Fact]
    public async Task ShouldPlaceOrder()
    {
        var sku = CreateUniqueSku(Defaults.SKU);
        (await _erpClient!.CreateProductAsync(new ExtCreateProductRequest { Id = sku, Title = "Test Product", Description = "Test Description", Category = "Test Category", Brand = "Test Brand", Price = "20.00" })).ShouldBeSuccess();

        var placeOrderRequest = new PlaceOrderRequest { Sku = sku, Quantity = "5", Country = Defaults.COUNTRY };
        var placeOrderResult = await _shopApiClient!.Orders().PlaceOrderAsync(placeOrderRequest);
        placeOrderResult.ShouldBeSuccess();

        var orderNumber = placeOrderResult.Value!.OrderNumber;
        orderNumber.ShouldStartWith("ORD-");

        var viewOrderResult = await _shopApiClient.Orders().ViewOrderAsync(orderNumber);
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















