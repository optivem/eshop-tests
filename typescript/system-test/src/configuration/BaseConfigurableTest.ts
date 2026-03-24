import type { ExternalSystemMode } from '@optivem/dsl-port/ExternalSystemMode.js';
import type { LoadedConfiguration } from './LoadedConfiguration.js';
import { Environment } from './Environment.js';
import { getEnvironment, getExternalSystemMode } from './PropertyLoader.js';
import { load } from './SystemConfigurationLoader.js';

/**
 * Abstract base for configurable tests.
 * Subclasses override getFixedEnvironment / getFixedExternalSystemMode to pin config; otherwise env vars are used.
 * In Playwright, use fixtures that call loadConfiguration() instead of extending this class.
 */
export abstract class BaseConfigurableTest {
    protected getFixedEnvironment(): Environment | null | undefined {
        return null;
    }

    protected getFixedExternalSystemMode(): ExternalSystemMode | null | undefined {
        return null;
    }

    protected loadConfiguration(): LoadedConfiguration {
        const environment = getEnvironment(this.getFixedEnvironment());
        const externalSystemMode = getExternalSystemMode(this.getFixedExternalSystemMode());
        return load(environment, externalSystemMode);
    }
}

