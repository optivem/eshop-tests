import type { ExternalSystemMode } from '@optivem/dsl-port/ExternalSystemMode.js';
import type { LoadedConfiguration } from './LoadedConfiguration.js';
import { Environment } from './Environment.js';

/**
 * Embedded test configs. Keys: environment + mode (e.g. LOCAL_REAL).
 */
const configs: Record<string, Omit<LoadedConfiguration, 'externalSystemMode'>> = {
    [`${Environment.LOCAL}_REAL`]: {
        shopUiBaseUrl: 'http://localhost:3001',
        shopApiBaseUrl: 'http://localhost:8081',
        erpBaseUrl: 'http://localhost:9001/erp',
        taxBaseUrl: 'http://localhost:9001/tax',
        clockBaseUrl: 'http://localhost',
    },
    [`${Environment.LOCAL}_STUB`]: {
        shopUiBaseUrl: 'http://localhost:3002',
        shopApiBaseUrl: 'http://localhost:8082',
        erpBaseUrl: 'http://localhost:9002/erp',
        taxBaseUrl: 'http://localhost:9002/tax',
        clockBaseUrl: 'http://localhost:9002/clock',
    },
    [`${Environment.ACCEPTANCE}_REAL`]: {
        shopUiBaseUrl: 'http://localhost:3001',
        shopApiBaseUrl: 'http://localhost:8081',
        erpBaseUrl: 'http://localhost:9001/erp',
        taxBaseUrl: 'http://localhost:9001/tax',
        clockBaseUrl: 'http://localhost',
    },
    [`${Environment.ACCEPTANCE}_STUB`]: {
        shopUiBaseUrl: 'http://localhost:3002',
        shopApiBaseUrl: 'http://localhost:8082',
        erpBaseUrl: 'http://localhost:9002/erp',
        taxBaseUrl: 'http://localhost:9002/tax',
        clockBaseUrl: 'http://localhost:9002/clock',
    },
    [`${Environment.QA}_REAL`]: {
        shopUiBaseUrl: 'http://localhost:3001',
        shopApiBaseUrl: 'http://localhost:8081',
        erpBaseUrl: 'http://localhost:9001/erp',
        taxBaseUrl: 'http://localhost:9001/tax',
        clockBaseUrl: 'http://localhost',
    },
    [`${Environment.PRODUCTION}_REAL`]: {
        shopUiBaseUrl: 'http://localhost:3001',
        shopApiBaseUrl: 'http://localhost:8081',
        erpBaseUrl: 'http://localhost:9001/erp',
        taxBaseUrl: 'http://localhost:9001/tax',
        clockBaseUrl: 'http://localhost',
    },
};

export function getTestConfig(
    environment: Environment,
    externalSystemMode: ExternalSystemMode
): LoadedConfiguration {
    const key = `${environment}_${externalSystemMode}`;
    const base = configs[key];
    if (!base) {
        throw new Error(`Configuration not found for ${key}. Available: ${Object.keys(configs).join(', ')}`);
    }
    return { ...base, externalSystemMode };
}

