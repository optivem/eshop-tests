package com.optivem.eshop.systemtest.latest.acceptance;

import com.optivem.eshop.systemtest.latest.acceptance.base.BaseAcceptanceTest;
import com.optivem.eshop.dsl.channel.ChannelType;
import com.optivem.testing.Channel;
import org.junit.jupiter.api.TestTemplate;

class BrowseCouponsPositiveTest extends BaseAcceptanceTest {
    @TestTemplate
    @Channel({ ChannelType.UI, ChannelType.API })
    void shouldBeAbleToBrowseCoupons() {
        scenario
                .when().browseCoupons()
                .then().shouldSucceed();
    }

}


