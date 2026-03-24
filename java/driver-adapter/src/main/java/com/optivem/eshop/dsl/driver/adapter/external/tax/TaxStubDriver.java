package com.optivem.eshop.dsl.driver.adapter.external.tax;

import com.optivem.eshop.dsl.driver.adapter.external.tax.client.TaxStubClient;
import com.optivem.eshop.dsl.driver.adapter.external.tax.client.dtos.ExtCountryDetailsResponse;
import com.optivem.eshop.dsl.driver.port.external.tax.dtos.ReturnsTaxRateRequest;
import com.optivem.eshop.dsl.driver.port.shared.dtos.ErrorResponse;
import com.optivem.eshop.dsl.common.Converter;
import com.optivem.eshop.dsl.common.Result;

public class TaxStubDriver extends BaseTaxDriver<TaxStubClient> {
    public TaxStubDriver(String baseUrl) {
        super(new TaxStubClient(baseUrl));
    }

    @Override
    public Result<Void, ErrorResponse> returnsTaxRate(ReturnsTaxRateRequest request) {
        var country = request.getCountry();
        var taxRate = Converter.toBigDecimal(request.getTaxRate());

        var response = ExtCountryDetailsResponse.builder()
                .id(country)
                .taxRate(taxRate)
                .countryName(country)
                .build();

        return client.configureGetCountry(response)
                .mapError(ext -> ErrorResponse.builder().message(ext.getMessage()).build());
    }
}
