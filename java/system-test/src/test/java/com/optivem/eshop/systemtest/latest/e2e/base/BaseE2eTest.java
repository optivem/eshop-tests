package com.optivem.eshop.systemtest.latest.e2e.base;

import com.optivem.eshop.systemtest.latest.base.BaseScenarioDslTest;
import com.optivem.eshop.dsl.port.ExternalSystemMode;

public class BaseE2eTest extends BaseScenarioDslTest {
    @Override
    protected ExternalSystemMode getFixedExternalSystemMode() {
        return ExternalSystemMode.REAL;
    }
}




