import { UseCaseContext } from '@optivem/dsl-core/shared';
import { ExternalSystemMode } from '@optivem/dsl-port/ExternalSystemMode.js';
import { Closer } from '@optivem/commons';
import type { TaxDriver } from '@optivem/driver-port/external/tax/TaxDriver.js';
import { TaxRealDriver } from '@optivem/driver-adapter/external/tax/TaxRealDriver.js';
import { TaxStubDriver } from '@optivem/driver-adapter/external/tax/TaxStubDriver.js';
import { GoToTax } from './usecases/GoToTax.js';
import { GetTaxRate } from './usecases/GetTaxRate.js';
import { ReturnsTaxRate } from './usecases/ReturnsTaxRate.js';

export class TaxDsl {
    private readonly driver: TaxDriver;
    private readonly context: UseCaseContext;

    constructor(baseUrl: string, context: UseCaseContext) {
        this.context = context;
        this.driver = TaxDsl.createDriver(baseUrl, context);
    }

    private static createDriver(baseUrl: string, context: UseCaseContext): TaxDriver {
        const mode = context.getExternalSystemMode();
        switch (mode) {
            case ExternalSystemMode.REAL:
                return new TaxRealDriver(baseUrl);
            case ExternalSystemMode.STUB:
                return new TaxStubDriver(baseUrl);
            default:
                throw new Error(`External system mode '${mode}' is not supported for TaxDsl.`);
        }
    }

    async close(): Promise<void> {
        await Closer.close(this.driver);
    }

    goToTax(): GoToTax {
        return new GoToTax(this.driver, this.context);
    }

    getTaxRate(): GetTaxRate {
        return new GetTaxRate(this.driver, this.context);
    }

    returnsTaxRate(): ReturnsTaxRate {
        return new ReturnsTaxRate(this.driver, this.context);
    }
}




