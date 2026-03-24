import { OrderStatus } from '@optivem/driver-port/shop/dtos/OrderStatus.js';

/**
 * Default values for Gherkin test builders.
 * These defaults are used when test data is not explicitly specified.
 */
export const GherkinDefaults = {
    /** Product defaults */
    DEFAULT_SKU: 'DEFAULT-SKU',
    DEFAULT_UNIT_PRICE: '20.00',

    /** Order defaults */
    DEFAULT_ORDER_NUMBER: 'DEFAULT-ORDER',
    DEFAULT_QUANTITY: '1',
    DEFAULT_COUNTRY: 'US',
    DEFAULT_ORDER_STATUS: OrderStatus.PLACED as OrderStatus,

    /** Clock defaults */
    DEFAULT_TIME: '2025-12-24T10:00:00Z',

    /** Tax defaults */
    DEFAULT_TAX_RATE: '0.07',

    /** Coupon defaults */
    DEFAULT_COUPON_CODE: 'DEFAULT-COUPON',
    DEFAULT_DISCOUNT_RATE: '0.10',
    DEFAULT_VALID_FROM: '2024-01-01T00:00:00Z',
    DEFAULT_VALID_TO: '2024-12-31T23:59:59Z',
    DEFAULT_USAGE_LIMIT: '1000',

    EMPTY: '',
} as const;

