import type { ExternalSystemMode } from '@optivem/dsl-port/ExternalSystemMode.js';
import { Configuration } from '@optivem/dsl-core/usecase/Configuration.js';
import { UseCaseDsl } from '@optivem/dsl-core/usecase/UseCaseDsl.js';
import { getConfiguration } from '../driver/configurationLoaderRegistry.js';

export class SystemDslFactory {
    static create(externalSystemMode: ExternalSystemMode): UseCaseDsl {
        const configuration = getConfiguration(externalSystemMode);
        const appConfiguration = new Configuration(
            configuration.shopUiBaseUrl,
            configuration.shopApiBaseUrl,
            configuration.erpBaseUrl,
            configuration.taxBaseUrl,
            configuration.clockBaseUrl,
            configuration.externalSystemMode
        );
        return new UseCaseDsl(appConfiguration);
    }
}
