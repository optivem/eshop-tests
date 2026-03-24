package com.optivem.eshop.dsl.core.scenario.given.steps;

import com.optivem.eshop.dsl.common.Converter;
import com.optivem.eshop.dsl.core.usecase.UseCaseDsl;
import com.optivem.eshop.dsl.core.scenario.given.GivenImpl;
import com.optivem.eshop.dsl.port.given.steps.GivenCountry;

import static com.optivem.eshop.dsl.core.scenario.ScenarioDefaults.*;

public class GivenCountryImpl extends BaseGivenStep implements GivenCountry {
    private String country;
    private String taxRate;

    public GivenCountryImpl(GivenImpl given) {
        super(given);
        withCode(DEFAULT_COUNTRY);
        withTaxRate(DEFAULT_TAX_RATE);
    }

    public GivenCountryImpl withCode(String country) {
        this.country = country;
        return this;
    }

    public GivenCountryImpl withTaxRate(String taxRate) {
        this.taxRate = taxRate;
        return this;
    }

    public GivenCountryImpl withTaxRate(double taxRate) {
        return withTaxRate(Converter.fromDouble(taxRate));
    }

    @Override
    public void execute(UseCaseDsl app) {
        app.tax().returnsTaxRate()
                .country(country)
                .taxRate(taxRate)
                .execute()
                .shouldSucceed();
    }
}


