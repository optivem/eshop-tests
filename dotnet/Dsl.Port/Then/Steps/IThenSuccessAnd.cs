namespace Dsl.Port.Then.Steps;

public interface IThenSuccessAnd
{
    IThenOrder Order(string orderNumber);

    IThenOrder Order();

    IThenCoupon Coupon(string couponCode);

    IThenCoupon Coupon();

    Task<IThenClock> Clock();

    Task<IThenProduct> Product(string skuAlias);

    Task<IThenCountry> Country(string countryAlias);
}
