import type { ExternalSystemMode } from '@optivem/dsl-port/ExternalSystemMode.js';

/**
 * Shape of loaded test configuration. Consumers can build their own Configuration from this.
 */
export interface LoadedConfiguration {
    shopUiBaseUrl: string;
    shopApiBaseUrl: string;
    erpBaseUrl: string;
    taxBaseUrl: string;
    clockBaseUrl: string;
    externalSystemMode: ExternalSystemMode;
}

