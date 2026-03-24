import { ExternalSystemMode } from '@optivem/dsl-port/ExternalSystemMode.js';
import type { LoadedConfiguration } from '../configuration/LoadedConfiguration.js';

let configurationLoader: ((mode: ExternalSystemMode) => LoadedConfiguration) | null = null;

export function setConfigurationLoader(loader: (mode: ExternalSystemMode) => LoadedConfiguration): void {
    configurationLoader = loader;
}

export function getDefaultExternalSystemMode(): ExternalSystemMode {
    return (process.env.EXTERNAL_SYSTEM_MODE?.toUpperCase() as 'STUB' | 'REAL') === 'STUB'
        ? ExternalSystemMode.STUB
        : ExternalSystemMode.REAL;
}

export function getConfiguration(mode?: ExternalSystemMode): LoadedConfiguration {
    const resolved = mode ?? getDefaultExternalSystemMode();
    if (!configurationLoader) {
        throw new Error('Configuration loader not set. Call setConfigurationLoader() from system-test setup.');
    }
    return configurationLoader(resolved);
}

