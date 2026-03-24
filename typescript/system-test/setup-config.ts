// Force UTC timezone for consistent test behavior across environments
process.env.TZ = 'UTC';

import type { ExternalSystemMode } from '@optivem/dsl-port/ExternalSystemMode.js';
import type { LoadedConfiguration } from './src/index.js';
import { setConfigurationLoader } from './src/index.js';
import { testConfig } from './test.config.js';

setConfigurationLoader((mode: ExternalSystemMode): LoadedConfiguration => ({
    shopUiBaseUrl: testConfig.urls.shopUi,
    shopApiBaseUrl: testConfig.urls.shopApi,
    erpBaseUrl: testConfig.urls.erpApi,
    taxBaseUrl: testConfig.urls.taxApi,
    clockBaseUrl: testConfig.urls.clockApi,
    externalSystemMode: mode,
}));

