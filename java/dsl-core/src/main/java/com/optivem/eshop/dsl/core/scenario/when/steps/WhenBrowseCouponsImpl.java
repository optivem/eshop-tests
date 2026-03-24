package com.optivem.eshop.dsl.core.scenario.when.steps;

import com.optivem.eshop.dsl.core.usecase.UseCaseDsl;
import com.optivem.eshop.dsl.core.scenario.ExecutionResult;
import com.optivem.eshop.dsl.core.scenario.ExecutionResultBuilder;
import com.optivem.eshop.dsl.port.when.steps.base.WhenStep;
import com.optivem.eshop.dsl.driver.port.shop.dtos.BrowseCouponsResponse;
import com.optivem.eshop.dsl.core.usecase.shop.usecases.BrowseCouponsVerification;

public class WhenBrowseCouponsImpl extends BaseWhenStep<BrowseCouponsResponse, BrowseCouponsVerification> implements WhenStep {
    public WhenBrowseCouponsImpl(UseCaseDsl app) {
        super(app);
    }

    @Override
    protected ExecutionResult<BrowseCouponsResponse, BrowseCouponsVerification> execute(UseCaseDsl app) {
        var result = app.shop()
                .browseCoupons()
                .execute();

        return new ExecutionResultBuilder<>(result)
                .build();
    }
}


