package com.optivem.eshop.dsl.driver.adapter.external.tax;

import com.optivem.eshop.dsl.driver.adapter.external.tax.client.TaxRealClient;
import com.optivem.eshop.dsl.driver.port.external.tax.dtos.ReturnsTaxRateRequest;
import com.optivem.eshop.dsl.driver.port.shared.dtos.ErrorResponse;
import com.optivem.eshop.dsl.common.Result;

public class TaxRealDriver extends BaseTaxDriver<TaxRealClient> {
    public TaxRealDriver(String baseUrl) {
        super(new TaxRealClient(baseUrl));
    }

    @Override
    public Result<Void, ErrorResponse> returnsTaxRate(ReturnsTaxRateRequest request) {
        // No-op for real driver - data already exists in real service
        return Result.success();
    }
}
