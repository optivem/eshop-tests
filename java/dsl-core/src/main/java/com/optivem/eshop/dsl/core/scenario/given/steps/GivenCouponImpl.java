package com.optivem.eshop.dsl.core.scenario.given.steps;

import com.optivem.eshop.dsl.common.Converter;
import com.optivem.eshop.dsl.core.usecase.UseCaseDsl;
import com.optivem.eshop.dsl.core.scenario.given.GivenImpl;
import com.optivem.eshop.dsl.port.given.steps.GivenCoupon;

import static com.optivem.eshop.dsl.core.scenario.ScenarioDefaults.*;

public class GivenCouponImpl extends BaseGivenStep implements GivenCoupon {
    private String couponCode;
    private String discountRate;
    private String validFrom;
    private String validTo;
    private String usageLimit;

    public GivenCouponImpl(GivenImpl given) {
        super(given);

        withCouponCode(DEFAULT_COUPON_CODE);
        withDiscountRate(DEFAULT_DISCOUNT_RATE);
        withValidFrom(EMPTY);
        withValidTo(EMPTY);
        withUsageLimit(EMPTY);
    }

    public GivenCouponImpl withCouponCode(String couponCode) {
        this.couponCode = couponCode;
        return this;
    }

    public GivenCouponImpl withDiscountRate(String discountRate) {
        this.discountRate = discountRate;
        return this;
    }

    public GivenCouponImpl withDiscountRate(double discountRate) {
        return withDiscountRate(Converter.fromDouble(discountRate));
    }

    public GivenCouponImpl withValidFrom(String validFrom) {
        this.validFrom = validFrom;
        return this;
    }

    public GivenCouponImpl withValidTo(String validTo) {
        this.validTo = validTo;
        return this;
    }

    public GivenCouponImpl withUsageLimit(String usageLimit) {
        this.usageLimit = usageLimit;
        return this;
    }

    public GivenCouponImpl withUsageLimit(int usageLimit) {
        return withUsageLimit(Converter.fromInteger(usageLimit));
    }

    @Override
    public void execute(UseCaseDsl app) {
        var result = app.shop().publishCoupon()
                .couponCode(couponCode)
                .discountRate(discountRate)
                .validFrom(validFrom)
                .validTo(validTo)
                .usageLimit(usageLimit)
                .execute();

        result.shouldSucceed();
    }
}


