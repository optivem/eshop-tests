import { BaseUseCase, UseCaseContext } from '@optivem/dsl-core/shared';
import type { TaxDriver } from '@optivem/driver-port/external/tax/TaxDriver.js';
import type { TaxErrorResponse } from '@optivem/driver-port/external/tax/dtos/error/TaxErrorResponse.js';
import { TaxErrorVerification } from './TaxErrorVerification.js';

export abstract class BaseTaxCommand<TResponse, TVerification> extends BaseUseCase<
    TaxDriver,
    TResponse,
    TaxErrorResponse,
    TVerification,
    TaxErrorVerification
> {
    protected constructor(driver: TaxDriver, context: UseCaseContext) {
        super(driver, context);
    }
}


