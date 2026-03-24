package com.optivem.eshop.dsl.core.scenario.given;

import com.optivem.eshop.dsl.core.usecase.UseCaseDsl;
import com.optivem.eshop.dsl.core.scenario.then.ThenImpl;
import com.optivem.eshop.dsl.core.scenario.given.steps.GivenClockImpl;
import com.optivem.eshop.dsl.core.scenario.given.steps.GivenCountryImpl;
import com.optivem.eshop.dsl.core.scenario.given.steps.GivenCouponImpl;
import com.optivem.eshop.dsl.core.scenario.given.steps.GivenOrderImpl;
import com.optivem.eshop.dsl.core.scenario.given.steps.GivenProductImpl;
import com.optivem.eshop.dsl.port.given.GivenStage;
import com.optivem.eshop.dsl.port.then.ThenStage;
import com.optivem.eshop.dsl.core.scenario.when.WhenImpl;

import java.util.ArrayList;
import java.util.List;

public class GivenImpl implements GivenStage {
    private final UseCaseDsl app;
    private GivenClockImpl clock;
    private final List<GivenProductImpl> products;
    private final List<GivenOrderImpl> orders;
    private final List<GivenCountryImpl> countries;
    private final List<GivenCouponImpl> coupons;

    public GivenImpl(UseCaseDsl app) {
        this.app = app;
        this.clock = null;
        this.products = new ArrayList<>();
        this.orders = new ArrayList<>();
        this.countries = new ArrayList<>();
        this.coupons = new ArrayList<>();
    }

    public GivenProductImpl product() {
        var product = new GivenProductImpl(this);
        products.add(product);
        return product;
    }

    public GivenOrderImpl order() {
        var order = new GivenOrderImpl(this);
        orders.add(order);
        return order;
    }

    public GivenClockImpl clock() {
        clock = new GivenClockImpl(this);
        return clock;
    }

    public GivenCountryImpl country() {
        var country = new GivenCountryImpl(this);
        countries.add(country);
        return country;
    }

    public GivenCouponImpl coupon() {
        var coupon = new GivenCouponImpl(this);
        coupons.add(coupon);
        return coupon;
    }

    public WhenImpl when() {
        setup();
        return new WhenImpl(app, !products.isEmpty(), !countries.isEmpty());
    }

    public ThenStage then() {
        setup();
        return new ThenImpl(app);
    }

    private void setup() {
        setupClock();
        setupErp();
        setupTax();
        setupShop();
    }

    private void setupClock() {
        if(clock != null) {
            clock.execute(app);
        }
    }

    private void setupErp() {
        if (!orders.isEmpty() && products.isEmpty()) {
            var defaultProduct = new GivenProductImpl(this);
            products.add(defaultProduct);
        }

        for (var product : products) {
            product.execute(app);
        }
    }

    private void setupTax() {
        if (!orders.isEmpty() && countries.isEmpty()) {
            var defaultCountry = new GivenCountryImpl(this);
            countries.add(defaultCountry);
        }

        for (var country : countries) {
            country.execute(app);
        }
    }

    private void setupShop() {
        setupCoupons();
        setupOrders();
    }

    private void setupCoupons() {
        if(!orders.isEmpty() && coupons.isEmpty()) {
            var defaultCoupon = new GivenCouponImpl(this);
            coupons.add(defaultCoupon);
        }

        for (var coupon : coupons) {
            coupon.execute(app);
        }
    }

    private void setupOrders() {
        for (var order : orders) {
            order.execute(app);
        }
    }
}



