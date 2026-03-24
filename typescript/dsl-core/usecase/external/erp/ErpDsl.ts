import { UseCaseContext } from '@optivem/dsl-core/shared';
import { ExternalSystemMode } from '@optivem/dsl-port/ExternalSystemMode.js';
import type { ErpDriver } from '@optivem/driver-port/external/erp/ErpDriver.js';
import { ErpRealDriver } from '@optivem/driver-adapter/external/erp/ErpRealDriver.js';
import { ErpStubDriver } from '@optivem/driver-adapter/external/erp/ErpStubDriver.js';
import { GetProduct } from './usecases/GetProduct.js';
import { GoToErp } from './usecases/GoToErp.js';
import { ReturnsProduct } from './usecases/ReturnsProduct.js';

export class ErpDsl {
    private readonly driver: ErpDriver;
    private readonly context: UseCaseContext;

    constructor(baseUrl: string, context: UseCaseContext) {
        this.context = context;
        this.driver = ErpDsl.createDriver(baseUrl, context);
    }

    private static createDriver(baseUrl: string, context: UseCaseContext): ErpDriver {
        const mode = context.getExternalSystemMode();
        switch (mode) {
            case ExternalSystemMode.REAL:
                return new ErpRealDriver(baseUrl);
            case ExternalSystemMode.STUB:
                return new ErpStubDriver(baseUrl);
            default:
                throw new Error(`External system mode '${mode}' is not supported for ErpDsl.`);
        }
    }

    goToErp(): GoToErp {
        return new GoToErp(this.driver, this.context);
    }

    getProduct(): GetProduct {
        return new GetProduct(this.driver, this.context);
    }

    returnsProduct(): ReturnsProduct {
        return new ReturnsProduct(this.driver, this.context);
    }
}




