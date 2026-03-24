package com.optivem.eshop.dsl.core.scenario.then.steps;

import com.optivem.eshop.dsl.core.shared.ResponseVerification;
import com.optivem.eshop.dsl.core.usecase.UseCaseDsl;
import com.optivem.eshop.dsl.core.scenario.ExecutionResultContext;
import com.optivem.eshop.dsl.port.then.steps.ThenOrder;
import com.optivem.eshop.dsl.driver.port.shop.dtos.OrderStatus;
import com.optivem.eshop.dsl.core.usecase.shop.usecases.PlaceOrderVerification;
import com.optivem.eshop.dsl.core.usecase.shop.usecases.ViewOrderVerification;

import static com.optivem.eshop.dsl.core.scenario.ScenarioDefaults.DEFAULT_COUPON_CODE;

public class ThenOrderImpl<TSuccessResponse, TSuccessVerification extends ResponseVerification<TSuccessResponse>>
        extends BaseThenStep<TSuccessResponse, TSuccessVerification> implements ThenOrder {
    private final ViewOrderVerification orderVerification;

    public ThenOrderImpl(UseCaseDsl app, ExecutionResultContext executionResult, String orderNumber, TSuccessVerification successVerification) {
        super(app, executionResult, successVerification);
        if (orderNumber == null) {
            throw new IllegalStateException("Cannot verify order: no order number available from the executed operation");
        }
        this.orderVerification = app.shop().viewOrder()
                .orderNumber(orderNumber)
                .execute()
                .shouldSucceed();
    }

    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasSku(String expectedSku) {
        orderVerification.sku(expectedSku);
        return this;
    }

    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasQuantity(int expectedQuantity) {
        orderVerification.quantity(expectedQuantity);
        return this;
    }

    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasCountry(String expectedCountry) {
        orderVerification.country(expectedCountry);
        return this;
    }

    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasUnitPrice(double expectedUnitPrice) {
        orderVerification.unitPrice(expectedUnitPrice);
        return this;
    }

    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasBasePrice(double expectedBasePrice) {
        orderVerification.basePrice(expectedBasePrice);
        return this;
    }

    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasBasePrice(String basePrice) {
        orderVerification.basePrice(basePrice);
        return this;
    }

    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasSubtotalPrice(double expectedSubtotalPrice) {
        orderVerification.subtotalPrice(expectedSubtotalPrice);
        return this;
    }

    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasSubtotalPrice(String expectedSubtotalPrice) {
        return hasSubtotalPrice(Double.parseDouble(expectedSubtotalPrice));
    }

    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasTotalPrice(double expectedTotalPrice) {
        orderVerification.totalPrice(expectedTotalPrice);
        return this;
    }

    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasStatus(OrderStatus expectedStatus) {
        orderVerification.status(expectedStatus);
        return this;
    }

    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasDiscountRateGreaterThanOrEqualToZero() {
        orderVerification.discountRateGreaterThanOrEqualToZero();
        return this;
    }

    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasDiscountRate(double expectedDiscountRate) {
        orderVerification.discountRate(expectedDiscountRate);
        return this;
    }

    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasDiscountAmount(double expectedDiscountAmount) {
        orderVerification.discountAmount(expectedDiscountAmount);
        return this;
    }

    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasDiscountAmount(String expectedDiscountAmount) {
        orderVerification.discountAmount(expectedDiscountAmount);
        return this;
    }

    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasAppliedCoupon(String expectedCouponCode) {
        orderVerification.appliedCouponCode(expectedCouponCode);
        return this;
    }

    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasAppliedCoupon() {
        return hasAppliedCoupon(DEFAULT_COUPON_CODE);
    }

    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasDiscountAmountGreaterThanOrEqualToZero() {
        orderVerification.discountAmountGreaterThanOrEqualToZero();
        return this;
    }


    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasSubtotalPriceGreaterThanZero() {
        orderVerification.subtotalPriceGreaterThanZero();
        return this;
    }

    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasTaxRate(double expectedTaxRate) {
        orderVerification.taxRate(expectedTaxRate);
        return this;
    }

    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasTaxRate(String expectedTaxRate) {
        orderVerification.taxRate(expectedTaxRate);
        return this;
    }

    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasTaxRateGreaterThanOrEqualToZero() {
        orderVerification.taxRateGreaterThanOrEqualToZero();
        return this;
    }


    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasTaxAmount(String expectedTaxAmount) {
        orderVerification.taxAmount(expectedTaxAmount);
        return this;
    }

    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasTaxAmountGreaterThanOrEqualToZero() {
        orderVerification.taxAmountGreaterThanOrEqualToZero();
        return this;
    }


    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasTotalPrice(String expectedTotalPrice) {
        orderVerification.totalPrice(expectedTotalPrice);
        return this;
    }

    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasTotalPriceGreaterThanZero() {
        orderVerification.totalPriceGreaterThanZero();
        return this;
    }

    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> hasOrderNumberPrefix(String expectedPrefix) {
        switch (successVerification) {
            case PlaceOrderVerification placeOrderVerification -> placeOrderVerification.orderNumberStartsWith(expectedPrefix);
            case ViewOrderVerification viewOrderVerification -> viewOrderVerification.orderNumberHasPrefix(expectedPrefix);
            case null -> { /* no-op: orderNumber prefix not applicable */ }
            default -> { /* no-op: verification type has no order number prefix check */ }
        }
        orderVerification.orderNumberHasPrefix(expectedPrefix);
        return this;
    }

    @Override
    public ThenOrderImpl<TSuccessResponse, TSuccessVerification> and() {
        return this;
    }
}




