import type { ExternalSystemMode } from '@optivem/dsl-port/ExternalSystemMode.js';
import { getConfiguration, getDefaultExternalSystemMode } from '../driver/configurationLoaderRegistry.js';

export interface LegacyTestConfig {
    urls: {
        shopUi: string;
        shopApi: string;
        erpApi: string;
        taxApi: string;
        clockApi: string;
    };
}

export function getExternalSystemMode(): ExternalSystemMode {
    return getDefaultExternalSystemMode();
}

export const testConfig: LegacyTestConfig = {
    get urls() {
        const config = getConfiguration(getDefaultExternalSystemMode());
        return {
            shopUi: config.shopUiBaseUrl,
            shopApi: config.shopApiBaseUrl,
            erpApi: config.erpBaseUrl,
            taxApi: config.taxBaseUrl,
            clockApi: config.clockBaseUrl,
        };
    },
};
