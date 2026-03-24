import type { ExternalSystemMode } from '@optivem/dsl-port/ExternalSystemMode.js';
import type { LoadedConfiguration } from './LoadedConfiguration.js';
import { Environment } from './Environment.js';
import { getTestConfig } from './test-configs.js';

/**
 * Loads test configuration by environment and external system mode.
 */
export function load(
    environment: Environment,
    externalSystemMode: ExternalSystemMode
): LoadedConfiguration {
    return getTestConfig(environment, externalSystemMode);
}

