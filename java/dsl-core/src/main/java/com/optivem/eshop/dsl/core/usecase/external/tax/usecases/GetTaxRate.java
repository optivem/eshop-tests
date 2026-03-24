package com.optivem.eshop.dsl.core.usecase.external.tax.usecases;

import com.optivem.eshop.dsl.driver.port.external.tax.TaxDriver;
import com.optivem.eshop.dsl.driver.port.external.tax.dtos.GetTaxResponse;
import com.optivem.eshop.dsl.core.usecase.external.tax.usecases.base.BaseTaxUseCase;
import com.optivem.eshop.dsl.core.shared.UseCaseResult;
import com.optivem.eshop.dsl.core.shared.UseCaseContext;

public class GetTaxRate extends BaseTaxUseCase<GetTaxResponse, GetTaxVerification> {
    private String countryValueOrAlias;

    public GetTaxRate(TaxDriver driver, UseCaseContext context) {
        super(driver, context);
    }

    public GetTaxRate country(String countryValueOrAlias) {
        this.countryValueOrAlias = countryValueOrAlias;
        return this;
    }

    @Override
    public UseCaseResult<GetTaxResponse, GetTaxVerification> execute() {
        var country = context.getParamValueOrLiteral(countryValueOrAlias);

        var result = driver.getTaxRate(country);

        return new UseCaseResult<>(result, context, GetTaxVerification::new);
    }
}
