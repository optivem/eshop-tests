import type { LoadedConfiguration } from '../../configuration/index.js';

/**
 * Fixture shape for v3 driver test.
 * Holds configuration and drivers: shopDriver (UI or API), erpDriver, taxDriver.
 * Types are unknown to avoid core dependency; implement in system-test with DriverFactory or equivalent.
 * Lifecycle: setUpConfiguration(), setUpShopUiDriver() or setUpShopApiDriver(), setUpExternalDrivers(), tearDown().
 */
export interface BaseDriverTestFixture {
    configuration: LoadedConfiguration;
    /** Shop driver (UI or API, set by one of the setUp*Driver methods) */
    shopDriver?: unknown;
    /** ERP driver */
    erpDriver?: unknown;
    /** Tax driver */
    taxDriver?: unknown;
}
