package com.optivem.eshop.dsl.core.usecase.external.tax.usecases.base;

import com.optivem.eshop.dsl.driver.port.external.tax.TaxDriver;
import com.optivem.eshop.dsl.core.shared.BaseUseCase;
import com.optivem.eshop.dsl.core.shared.UseCaseContext;

public abstract class BaseTaxUseCase<TResponse, TVerification> extends BaseUseCase<TaxDriver, TResponse, TVerification> {
    protected BaseTaxUseCase(TaxDriver driver, UseCaseContext context) {
        super(driver, context);
    }
}
