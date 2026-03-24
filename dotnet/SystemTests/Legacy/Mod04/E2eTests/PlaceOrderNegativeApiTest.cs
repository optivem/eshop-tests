using Common;
using Driver.Adapter.External.Erp.Client.Dtos;
using Driver.Port.Shop.Dtos.Error;
using Driver.Port.Shop.Dtos;
using SystemTests.Commons.Constants;
using SystemTests.Legacy.Mod04.E2eTests.Base;
using SystemTests.Legacy.Mod06.E2eTests.Helpers;
using SystemTests.Commons.Providers;
using SystemTests.Legacy.Mod04.Base;
using Driver.Adapter.Shop.Api.Client.Dtos.Errors;
using Shouldly;
using Xunit;

namespace SystemTests.Legacy.Mod04.E2eTests;

public class PlaceOrderNegativeApiTest : BaseE2eTest
{
    protected override Task SetShopClientAsync()
    {
        SetUpShopApiClient();
        return Task.CompletedTask;
    }

    [Fact]
    public async Task ShouldRejectOrderWithInvalidQuantity()
    {
        var request = new PlaceOrderRequest { Sku = CreateUniqueSku(Defaults.SKU), Quantity = "invalid-quantity", Country = Defaults.COUNTRY };
        var result = await _shopApiClient!.Orders().PlaceOrderAsync(request);
        result.ShouldBeFailure();
        result.Error.Detail.ShouldBe("The request contains one or more validation errors");
        result.Error.Errors.ShouldNotBeNull();
        result.Error.Errors.ShouldContain(e => e.Field == "quantity" && e.Message == "Quantity must be an integer");
    }

    [Fact]
    public async Task ShouldRejectOrderWithNonExistentSku()
    {
        var request = new PlaceOrderRequest { Sku = "NON-EXISTENT-SKU-12345", Quantity = Defaults.QUANTITY, Country = Defaults.COUNTRY };
        var result = await _shopApiClient!.Orders().PlaceOrderAsync(request);
        result.ShouldBeFailure();
        result.Error.Detail.ShouldBe("The request contains one or more validation errors");
        result.Error.Errors.ShouldNotBeNull();
        result.Error.Errors.ShouldContain(e => e.Field == "sku" && e.Message == "Product does not exist for SKU: NON-EXISTENT-SKU-12345");
    }

    [Fact]
    public async Task ShouldRejectOrderWithNegativeQuantity()
    {
        var request = new PlaceOrderRequest { Sku = CreateUniqueSku(Defaults.SKU), Quantity = "-10", Country = Defaults.COUNTRY };
        var result = await _shopApiClient!.Orders().PlaceOrderAsync(request);
        result.ShouldBeFailure();
        result.Error.Detail.ShouldBe("The request contains one or more validation errors");
        result.Error.Errors.ShouldNotBeNull();
        result.Error.Errors.ShouldContain(e => e.Field == "quantity" && e.Message == "Quantity must be positive");
    }

    [Fact]
    public async Task ShouldRejectOrderWithZeroQuantity()
    {
        var request = new PlaceOrderRequest { Sku = CreateUniqueSku(Defaults.SKU), Quantity = "0", Country = Defaults.COUNTRY };
        var result = await _shopApiClient!.Orders().PlaceOrderAsync(request);
        result.ShouldBeFailure();
        result.Error.Detail.ShouldBe("The request contains one or more validation errors");
        result.Error.Errors.ShouldNotBeNull();
        result.Error.Errors.ShouldContain(e => e.Field == "quantity" && e.Message == "Quantity must be positive");
    }

    [Theory]
    [ClassData(typeof(EmptyArgumentsProvider))]
    public async Task ShouldRejectOrderWithEmptySku(string sku)
    {
        var request = new PlaceOrderRequest { Sku = sku, Quantity = Defaults.QUANTITY, Country = Defaults.COUNTRY };
        var result = await _shopApiClient!.Orders().PlaceOrderAsync(request);
        result.ShouldBeFailure();
        result.Error.Detail.ShouldBe("The request contains one or more validation errors");
        result.Error.Errors.ShouldNotBeNull();
        result.Error.Errors.ShouldContain(e => e.Field == "sku" && e.Message == "SKU must not be empty");
    }

    [Theory]
    [ClassData(typeof(EmptyArgumentsProvider))]
    public async Task ShouldRejectOrderWithEmptyQuantity(string emptyQuantity)
    {
        var request = new PlaceOrderRequest { Sku = CreateUniqueSku(Defaults.SKU), Quantity = emptyQuantity, Country = Defaults.COUNTRY };
        var result = await _shopApiClient!.Orders().PlaceOrderAsync(request);
        result.ShouldBeFailure();
        result.Error.Detail.ShouldBe("The request contains one or more validation errors");
        result.Error.Errors.ShouldNotBeNull();
        result.Error.Errors.ShouldContain(e => e.Field == "quantity" && e.Message == "Quantity must not be empty");
    }

    [Theory]
    [InlineData("3.5")]
    [InlineData("lala")]
    public async Task ShouldRejectOrderWithNonIntegerQuantity(string nonIntegerQuantity)
    {
        var request = new PlaceOrderRequest { Sku = CreateUniqueSku(Defaults.SKU), Quantity = nonIntegerQuantity, Country = Defaults.COUNTRY };
        var result = await _shopApiClient!.Orders().PlaceOrderAsync(request);
        result.ShouldBeFailure();
        result.Error.Detail.ShouldBe("The request contains one or more validation errors");
        result.Error.Errors.ShouldNotBeNull();
        result.Error.Errors.ShouldContain(e => e.Field == "quantity" && e.Message == "Quantity must be an integer");
    }

    [Fact]
    public async Task ShouldRejectOrderWithEmptyCountry()
    {
        var request = new PlaceOrderRequest { Sku = CreateUniqueSku(Defaults.SKU), Quantity = Defaults.QUANTITY, Country = "" };
        var result = await _shopApiClient!.Orders().PlaceOrderAsync(request);
        result.ShouldBeFailure();
        result.Error.Detail.ShouldBe("The request contains one or more validation errors");
        result.Error.Errors.ShouldNotBeNull();
        result.Error.Errors.ShouldContain(e => e.Field == "country" && e.Message == "Country must not be empty");
    }

    [Fact]
    public async Task ShouldRejectOrderWithInvalidCountry()
    {
        var sku = CreateUniqueSku(Defaults.SKU);
        (await _erpClient!.CreateProductAsync(new ExtCreateProductRequest { Id = sku, Title = "Test", Description = "Test", Category = "Test", Brand = "Test", Price = "20.00" })).ShouldBeSuccess();
        var request = new PlaceOrderRequest { Sku = sku, Quantity = Defaults.QUANTITY, Country = "XX" };
        var result = await _shopApiClient!.Orders().PlaceOrderAsync(request);
        result.ShouldBeFailure();
        result.Error.Detail.ShouldBe("The request contains one or more validation errors");
        result.Error.Errors.ShouldNotBeNull();
        result.Error.Errors.ShouldContain(e => e.Field == "country" && e.Message == "Country does not exist: XX");
    }

    [Fact]
    public async Task ShouldRejectOrderWithNullQuantity()
    {
        var request = new PlaceOrderRequest { Sku = CreateUniqueSku(Defaults.SKU), Country = Defaults.COUNTRY, Quantity = null };
        var result = await _shopApiClient!.Orders().PlaceOrderAsync(request);
        result.ShouldBeFailure();
        result.Error.Detail.ShouldBe("The request contains one or more validation errors");
        result.Error.Errors.ShouldNotBeNull();
        result.Error.Errors.ShouldContain(e => e.Field == "quantity" && e.Message == "Quantity must not be empty");
    }

    [Fact]
    public async Task ShouldRejectOrderWithNullSku()
    {
        var request = new PlaceOrderRequest { Sku = null, Quantity = Defaults.QUANTITY, Country = Defaults.COUNTRY };
        var result = await _shopApiClient!.Orders().PlaceOrderAsync(request);
        result.ShouldBeFailure();
        result.Error.Detail.ShouldBe("The request contains one or more validation errors");
        result.Error.Errors.ShouldNotBeNull();
        result.Error.Errors.ShouldContain(e => e.Field == "sku" && e.Message == "SKU must not be empty");
    }

    [Fact]
    public async Task ShouldRejectOrderWithNullCountry()
    {
        var request = new PlaceOrderRequest { Sku = CreateUniqueSku(Defaults.SKU), Quantity = Defaults.QUANTITY, Country = null };
        var result = await _shopApiClient!.Orders().PlaceOrderAsync(request);
        result.ShouldBeFailure();
        result.Error.Detail.ShouldBe("The request contains one or more validation errors");
        result.Error.Errors.ShouldNotBeNull();
        result.Error.Errors.ShouldContain(e => e.Field == "country" && e.Message == "Country must not be empty");
    }
}















