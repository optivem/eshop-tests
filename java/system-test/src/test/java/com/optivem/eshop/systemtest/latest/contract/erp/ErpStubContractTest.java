package com.optivem.eshop.systemtest.latest.contract.erp;

import com.optivem.eshop.dsl.port.ExternalSystemMode;

public class ErpStubContractTest extends BaseErpContractTest {
    @Override
    protected ExternalSystemMode getFixedExternalSystemMode() {
        return ExternalSystemMode.STUB;
    }
}



