package com.optivem.eshop.dsl.driver.adapter.external.tax.client;

import com.optivem.eshop.dsl.driver.adapter.external.tax.client.dtos.ExtCountryDetailsResponse;
import com.optivem.eshop.dsl.driver.adapter.external.tax.client.dtos.error.ExtTaxErrorResponse;
import com.optivem.eshop.dsl.driver.adapter.shared.client.http.JsonHttpClient;
import com.optivem.eshop.dsl.common.Closer;
import com.optivem.eshop.dsl.common.Result;

public abstract class BaseTaxClient implements AutoCloseable {
    private static final String HEALTH_ENDPOINT = "/health";
    private static final String COUNTRIES_ENDPOINT = "/api/countries";

    protected final JsonHttpClient<ExtTaxErrorResponse> httpClient;

    protected BaseTaxClient(String baseUrl) {
        this.httpClient = new JsonHttpClient<>(baseUrl, ExtTaxErrorResponse.class);
    }

    @Override
    public void close() {
        Closer.close(httpClient);
    }

    public Result<Void, ExtTaxErrorResponse> checkHealth() {
        return httpClient.get(HEALTH_ENDPOINT);
    }

    public Result<ExtCountryDetailsResponse, ExtTaxErrorResponse> getCountry(String country) {
        return httpClient.get(COUNTRIES_ENDPOINT + "/" + country, ExtCountryDetailsResponse.class);
    }
}
