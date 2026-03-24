package com.optivem.eshop.systemtest.latest.acceptance.base;

import com.optivem.eshop.systemtest.latest.base.BaseScenarioDslTest;
import com.optivem.eshop.dsl.port.ExternalSystemMode;

public class BaseAcceptanceTest extends BaseScenarioDslTest {
    @Override
    protected ExternalSystemMode getFixedExternalSystemMode() {
        return ExternalSystemMode.STUB;
    }
}


