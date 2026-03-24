import type { LoadedConfiguration } from '../../configuration/index.js';

/**
 * Fixture shape for v1 raw test.
 * Holds configuration, Playwright browser/page, HTTP clients, and JSON mapper.
 * Types are unknown to avoid pulling Playwright/Node into test-infrastructure; implement in system-test with real types.
 * Lifecycle: setUpConfiguration(), setUpShopBrowser(), setUpShopHttpClient(), setUpExternalHttpClients(), tearDown().
 */
export interface BaseRawTestFixture {
    configuration: LoadedConfiguration;
    /** Playwright root (set in setUpShopBrowser) */
    shopUiPlaywright?: unknown;
    /** Chromium browser instance */
    shopUiBrowser?: unknown;
    /** Browser context (viewport, storage) */
    shopUiBrowserContext?: unknown;
    /** Current page */
    shopUiPage?: unknown;
    /** HTTP client for shop API */
    shopApiHttpClient?: unknown;
    /** HTTP client for ERP API */
    erpHttpClient?: unknown;
    /** HTTP client for Tax API */
    taxHttpClient?: unknown;
    /** JSON serialize/deserialize options or mapper */
    httpObjectMapper?: unknown;
}
