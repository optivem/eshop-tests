package com.optivem.eshop.dsl.core.scenario;

import com.optivem.eshop.dsl.driver.port.shop.dtos.OrderStatus;

/**
 * Default values for Gherkin test steps.
 * These defaults are used when test data is not explicitly specified.
 */
public final class ScenarioDefaults {
    
    // Product defaults
    public static final String DEFAULT_SKU = "DEFAULT-SKU";
    public static final String DEFAULT_UNIT_PRICE = "20.00";
    
    // Order defaults
    public static final String DEFAULT_ORDER_NUMBER = "DEFAULT-ORDER";
    public static final String DEFAULT_QUANTITY = "1";
    public static final String DEFAULT_COUNTRY = "US";
    public static final OrderStatus DEFAULT_ORDER_STATUS = OrderStatus.PLACED;

    // Clock defaults
    public static final String DEFAULT_TIME = "2025-12-24T10:00:00Z";
    
    // Tax defaults
    public static final String DEFAULT_TAX_RATE = "0.07";
    
    // Coupon defaults
    public static final String DEFAULT_COUPON_CODE = "DEFAULT-COUPON";
    public static final String DEFAULT_DISCOUNT_RATE = "0.10";
    public static final String DEFAULT_VALID_FROM = "2024-01-01T00:00:00Z";
    public static final String DEFAULT_VALID_TO = "2024-12-31T23:59:59Z";
    public static final String DEFAULT_USAGE_LIMIT = "1000";

    public static final String EMPTY = "";

    private ScenarioDefaults() {
        // Prevent instantiation
    }
}

