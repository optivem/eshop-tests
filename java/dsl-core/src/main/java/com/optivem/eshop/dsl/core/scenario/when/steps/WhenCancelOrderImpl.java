package com.optivem.eshop.dsl.core.scenario.when.steps;

import com.optivem.eshop.dsl.core.shared.VoidVerification;
import com.optivem.eshop.dsl.core.usecase.UseCaseDsl;
import com.optivem.eshop.dsl.core.scenario.ExecutionResult;
import com.optivem.eshop.dsl.core.scenario.ExecutionResultBuilder;
import com.optivem.eshop.dsl.port.when.steps.WhenCancelOrder;

import static com.optivem.eshop.dsl.core.scenario.ScenarioDefaults.DEFAULT_ORDER_NUMBER;

public class WhenCancelOrderImpl extends BaseWhenStep<Void, VoidVerification> implements WhenCancelOrder {
    private String orderNumber;

    public WhenCancelOrderImpl(UseCaseDsl app) {
        super(app);
        withOrderNumber(DEFAULT_ORDER_NUMBER);
    }

    public WhenCancelOrderImpl withOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
        return this;
    }

    @Override
    protected ExecutionResult<Void, VoidVerification> execute(UseCaseDsl app) {
        var result = app.shop().cancelOrder()
                .orderNumber(orderNumber)
                .execute();

        return new ExecutionResultBuilder<>(result)
                .orderNumber(orderNumber)
                .build();
    }
}




