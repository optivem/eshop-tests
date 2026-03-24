package com.optivem.eshop.systemtest.latest.contract.tax;

import com.optivem.eshop.dsl.port.ExternalSystemMode;

public class TaxRealContractTest extends BaseTaxContractTest {
    @Override
    protected ExternalSystemMode getFixedExternalSystemMode() {
        return ExternalSystemMode.REAL;
    }
}



