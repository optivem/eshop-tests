import type { LoadedConfiguration } from '../../configuration/index.js';

/**
 * Fixture shape for v4 channel driver test.
 * Same as v3 but shopDriver is chosen by channel (UI vs API) from ChannelContext/ChannelExtension.
 * Types are unknown to avoid core dependency; implement in system-test with channelTest + DriverFactory.
 * Lifecycle: load configuration, createShopDriver(config) by channel, erpDriver, taxDriver; tearDown.
 */
export interface BaseChannelDriverTestFixture {
    /** Resolved config (used in setUp) */
    configuration?: LoadedConfiguration;
    /** Shop driver for current channel (UI or API) */
    shopDriver?: unknown;
    /** ERP driver */
    erpDriver?: unknown;
    /** Tax driver */
    taxDriver?: unknown;
}
