package com.optivem.eshop.dsl.core.scenario.when;

import com.optivem.eshop.dsl.core.usecase.UseCaseDsl;
import com.optivem.eshop.dsl.core.scenario.when.steps.WhenBrowseCouponsImpl;
import com.optivem.eshop.dsl.core.scenario.when.steps.WhenCancelOrderImpl;
import com.optivem.eshop.dsl.core.scenario.when.steps.WhenPlaceOrderImpl;
import com.optivem.eshop.dsl.core.scenario.when.steps.WhenPublishCouponImpl;
import com.optivem.eshop.dsl.core.scenario.when.steps.WhenViewOrderImpl;
import com.optivem.eshop.dsl.port.when.WhenStage;

import static com.optivem.eshop.dsl.core.scenario.ScenarioDefaults.*;

public class WhenImpl implements WhenStage {
    private final UseCaseDsl app;
    private boolean hasProduct;
    private boolean hasTaxRate;

    public WhenImpl(UseCaseDsl app, boolean hasProduct, boolean hasTaxRate) {
        this.app = app;
        this.hasProduct = hasProduct;
        this.hasTaxRate = hasTaxRate;
    }

    public WhenImpl(UseCaseDsl app) {
        this(app, false, false);
    }

    private void ensureDefaults() {
        if (!hasProduct) {
            app.erp().returnsProduct()
                    .sku(DEFAULT_SKU)
                    .unitPrice(DEFAULT_UNIT_PRICE)
                    .execute()
                    .shouldSucceed();
            hasProduct = true;
        }

        if (!hasTaxRate) {
            app.tax().returnsTaxRate()
                    .country(DEFAULT_COUNTRY)
                    .taxRate(DEFAULT_TAX_RATE)
                    .execute()
                    .shouldSucceed();
            hasTaxRate = true;
        }
    }

    public WhenPlaceOrderImpl placeOrder() {
        ensureDefaults();
        return new WhenPlaceOrderImpl(app);
    }

    public WhenCancelOrderImpl cancelOrder() {
        ensureDefaults();
        return new WhenCancelOrderImpl(app);
    }

    public WhenViewOrderImpl viewOrder() {
        ensureDefaults();
        return new WhenViewOrderImpl(app);
    }

    public WhenPublishCouponImpl publishCoupon() {
        return new WhenPublishCouponImpl(app);
    }

    public WhenBrowseCouponsImpl browseCoupons() {
        return new WhenBrowseCouponsImpl(app);
    }

}



