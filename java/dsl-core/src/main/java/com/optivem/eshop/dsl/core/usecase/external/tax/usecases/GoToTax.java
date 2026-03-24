package com.optivem.eshop.dsl.core.usecase.external.tax.usecases;

import com.optivem.eshop.dsl.driver.port.external.tax.TaxDriver;
import com.optivem.eshop.dsl.core.usecase.external.tax.usecases.base.BaseTaxUseCase;
import com.optivem.eshop.dsl.core.shared.UseCaseResult;
import com.optivem.eshop.dsl.core.shared.UseCaseContext;
import com.optivem.eshop.dsl.core.shared.VoidVerification;

public class GoToTax extends BaseTaxUseCase<Void, VoidVerification> {
    public GoToTax(TaxDriver driver, UseCaseContext context) {
        super(driver, context);
    }

    @Override
    public UseCaseResult<Void, VoidVerification> execute() {
        var result = driver.goToTax();
        return new UseCaseResult<>(result, context, VoidVerification::new);
    }
}
