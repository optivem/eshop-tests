package com.optivem.eshop.dsl.port.when;

import com.optivem.eshop.dsl.port.when.steps.WhenCancelOrder;
import com.optivem.eshop.dsl.port.when.steps.WhenPlaceOrder;
import com.optivem.eshop.dsl.port.when.steps.WhenPublishCoupon;
import com.optivem.eshop.dsl.port.when.steps.WhenViewOrder;
import com.optivem.eshop.dsl.port.when.steps.base.WhenStep;

public interface WhenStage {
    WhenPlaceOrder placeOrder();

    WhenCancelOrder cancelOrder();

    WhenViewOrder viewOrder();

    WhenPublishCoupon publishCoupon();

    WhenStep browseCoupons();
}


