package com.optivem.eshop.systemtest.latest.contract.clock;

import com.optivem.eshop.dsl.port.ExternalSystemMode;

public class ClockRealContractTest extends BaseClockContractTest {
    @Override
    protected ExternalSystemMode getFixedExternalSystemMode() {
        return ExternalSystemMode.REAL;
    }
}



