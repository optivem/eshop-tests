import type { LoadedConfiguration } from '../../configuration/index.js';

/**
 * Fixture shape for v2 client test.
 * Holds configuration and clients: shop UI client, shop API client, ERP client, tax client.
 * Types are unknown to avoid core dependency; implement in system-test with real client types.
 * Lifecycle: setUpConfiguration(), setUpShopUiClient(), setUpShopApiClient(), setUpExternalClients(), tearDown().
 */
export interface BaseClientTestFixture {
    configuration: LoadedConfiguration;
    /** Shop UI client (e.g. Playwright-based) */
    shopUiClient?: unknown;
    /** Shop API client */
    shopApiClient?: unknown;
    /** ERP client */
    erpClient?: unknown;
    /** Tax client */
    taxClient?: unknown;
}
