package com.optivem.eshop.dsl.port.then.steps;

import com.optivem.eshop.dsl.driver.port.shop.dtos.OrderStatus;
import com.optivem.eshop.dsl.port.then.steps.base.ThenStep;

public interface ThenOrder extends ThenStep<ThenOrder> {
    ThenOrder hasSku(String expectedSku);

    ThenOrder hasQuantity(int expectedQuantity);

    ThenOrder hasCountry(String expectedCountry);

    ThenOrder hasUnitPrice(double expectedUnitPrice);

    ThenOrder hasBasePrice(double expectedBasePrice);

    ThenOrder hasBasePrice(String basePrice);

    ThenOrder hasSubtotalPrice(double expectedSubtotalPrice);

    ThenOrder hasSubtotalPrice(String expectedSubtotalPrice);

    ThenOrder hasTotalPrice(double expectedTotalPrice);

    ThenOrder hasTotalPrice(String expectedTotalPrice);

    ThenOrder hasStatus(OrderStatus expectedStatus);

    ThenOrder hasDiscountRateGreaterThanOrEqualToZero();

    ThenOrder hasDiscountRate(double expectedDiscountRate);

    ThenOrder hasDiscountAmount(double expectedDiscountAmount);

    ThenOrder hasDiscountAmount(String expectedDiscountAmount);

    ThenOrder hasAppliedCoupon(String expectedCouponCode);

    ThenOrder hasAppliedCoupon();

    ThenOrder hasDiscountAmountGreaterThanOrEqualToZero();

    ThenOrder hasSubtotalPriceGreaterThanZero();

    ThenOrder hasTaxRate(double expectedTaxRate);

    ThenOrder hasTaxRate(String expectedTaxRate);

    ThenOrder hasTaxRateGreaterThanOrEqualToZero();

    ThenOrder hasTaxAmount(String expectedTaxAmount);

    ThenOrder hasTaxAmountGreaterThanOrEqualToZero();

    ThenOrder hasTotalPriceGreaterThanZero();

    ThenOrder hasOrderNumberPrefix(String expectedPrefix);
}

