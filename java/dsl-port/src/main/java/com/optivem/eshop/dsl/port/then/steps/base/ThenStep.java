package com.optivem.eshop.dsl.port.then.steps.base;

import com.optivem.eshop.dsl.port.then.steps.ThenClock;
import com.optivem.eshop.dsl.port.then.steps.ThenCountry;
import com.optivem.eshop.dsl.port.then.steps.ThenCoupon;
import com.optivem.eshop.dsl.port.then.steps.ThenOrder;
import com.optivem.eshop.dsl.port.then.steps.ThenProduct;
public interface ThenStep<TThen> {
    TThen and();

    ThenOrder order();

    ThenOrder order(String orderNumber);

    ThenCoupon coupon();

    ThenCoupon coupon(String couponCode);

    ThenClock clock();

    ThenProduct product(String skuAlias);

    ThenCountry country(String countryAlias);
}

