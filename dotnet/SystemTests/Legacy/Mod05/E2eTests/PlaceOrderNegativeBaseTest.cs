using Common;
using SystemTests.Commons.Providers;
using Driver.Port.External.Erp.Dtos;
using Driver.Port.Shop.Dtos;
using SystemTests.Commons.Constants;
using SystemTests.Legacy.Mod05.E2eTests.Base;
using SystemTests.Legacy.Mod06.E2eTests.Helpers;
using Shouldly;
using Xunit;

namespace SystemTests.Legacy.Mod05.E2eTests;

public abstract class PlaceOrderNegativeBaseTest : BaseE2eTest
{
    [Fact]
    public async Task ShouldRejectOrderWithInvalidQuantity()
    {
        var request = new PlaceOrderRequest 
        {
            Sku = CreateUniqueSku(Defaults.SKU), 
            Quantity = "invalid-quantity", 
            Country = Defaults.COUNTRY 
        };

        var result = await _shopDriver!.PlaceOrderAsync(request);
        result.ShouldBeFailure();
        result.Error.ShouldHaveMessageAndField("The request contains one or more validation errors", "quantity", "Quantity must be an integer");
    }

    [Fact]
    public async Task ShouldRejectOrderWithNonExistentSku()
    {
        var request = new PlaceOrderRequest 
        {
            Sku = "NON-EXISTENT-SKU-12345", 
            Quantity = Defaults.QUANTITY, 
            Country = Defaults.COUNTRY 
        };
        var result = await _shopDriver!.PlaceOrderAsync(request);
        result.ShouldBeFailure();
        result.Error.ShouldHaveMessageAndField("The request contains one or more validation errors", "sku", "Product does not exist for SKU: NON-EXISTENT-SKU-12345");
    }

    [Fact]
    public async Task ShouldRejectOrderWithNegativeQuantity()
    {
        var request = new PlaceOrderRequest 
        {
            Sku = CreateUniqueSku(Defaults.SKU), 
            Quantity = "-10", 
            Country = Defaults.COUNTRY 
        };
        var result = await _shopDriver!.PlaceOrderAsync(request);
        result.ShouldBeFailure();
        result.Error.ShouldHaveMessageAndField("The request contains one or more validation errors", "quantity", "Quantity must be positive");
    }

    [Fact]
    public async Task ShouldRejectOrderWithZeroQuantity()
    {
        var request = new PlaceOrderRequest 
        {
            Sku = "ANOTHER-SKU-67890", 
            Quantity = "0", 
            Country = Defaults.COUNTRY 
        };
        var result = await _shopDriver!.PlaceOrderAsync(request);
        result.ShouldBeFailure();
        result.Error.ShouldHaveMessageAndField("The request contains one or more validation errors", "quantity", "Quantity must be positive");
    }

    [Theory]
    [ClassData(typeof(EmptyArgumentsProvider))]
    public async Task ShouldRejectOrderWithEmptySku(string sku)
    {
        var request = new PlaceOrderRequest 
        {
            Sku = sku, 
            Quantity = Defaults.QUANTITY, 
            Country = Defaults.COUNTRY 
        };
        var result = await _shopDriver!.PlaceOrderAsync(request);
        result.ShouldBeFailure();
        result.Error.ShouldHaveMessageAndField("The request contains one or more validation errors", "sku", "SKU must not be empty");
    }

    [Theory]
    [ClassData(typeof(EmptyArgumentsProvider))]
    public async Task ShouldRejectOrderWithEmptyQuantity(string emptyQuantity)
    {
        var request = new PlaceOrderRequest 
        {
            Sku = CreateUniqueSku(Defaults.SKU), 
            Quantity = emptyQuantity, 
            Country = Defaults.COUNTRY 
        };
        var result = await _shopDriver!.PlaceOrderAsync(request);
        result.ShouldBeFailure();
        result.Error.ShouldHaveMessageAndField("The request contains one or more validation errors", "quantity", "Quantity must not be empty");
    }

    [Theory]
    [InlineData("3.5")]
    [InlineData("lala")]
    public async Task ShouldRejectOrderWithNonIntegerQuantity(string nonIntegerQuantity)
    {
        var request = new PlaceOrderRequest 
        {
            Sku = CreateUniqueSku(Defaults.SKU), 
            Quantity = nonIntegerQuantity, 
            Country = Defaults.COUNTRY 
        };
        var result = await _shopDriver!.PlaceOrderAsync(request);
        result.ShouldBeFailure();
        result.Error.ShouldHaveMessageAndField("The request contains one or more validation errors", "quantity", "Quantity must be an integer");
    }

    [Fact]
    public async Task ShouldRejectOrderWithEmptyCountry()
    {
        var request = new PlaceOrderRequest 
        {
            Sku = CreateUniqueSku(Defaults.SKU), 
            Quantity = Defaults.QUANTITY, 
            Country = "" 
        };
        var result = await _shopDriver!.PlaceOrderAsync(request);
        result.ShouldBeFailure();
        result.Error.ShouldHaveMessageAndField("The request contains one or more validation errors", "country", "Country must not be empty");
    }

    [Fact]
    public async Task ShouldRejectOrderWithInvalidCountry()
    {
        var sku = CreateUniqueSku(Defaults.SKU);
        (await _erpDriver!.ReturnsProductAsync(new ReturnsProductRequest { Sku = sku, Price = "20.00" })).ShouldBeSuccess();
        var request = new PlaceOrderRequest 
        {
            Sku = sku, 
            Quantity = Defaults.QUANTITY, 
            Country = "XX" 
        };
        var result = await _shopDriver!.PlaceOrderAsync(request);
        result.ShouldBeFailure();
        result.Error.ShouldHaveMessageAndField("The request contains one or more validation errors", "country", "Country does not exist: XX");
    }
}













