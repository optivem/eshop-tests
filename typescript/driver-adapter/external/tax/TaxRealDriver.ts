import { Result } from '@optivem/commons';
import { TaxRealClient } from './client/TaxRealClient.js';
import type { ReturnsTaxRateRequest } from '@optivem/driver-port/external/tax/dtos/ReturnsTaxRateRequest.js';
import type { TaxErrorResponse } from '@optivem/driver-port/external/tax/dtos/error/TaxErrorResponse.js';
import { BaseTaxDriver } from './BaseTaxDriver.js';

export class TaxRealDriver extends BaseTaxDriver<TaxRealClient> {
    constructor(baseUrl: string) {
        super(new TaxRealClient(baseUrl));
    }

    returnsTaxRate(request: ReturnsTaxRateRequest): Promise<Result<void, TaxErrorResponse>> {
        return Promise.resolve(Result.success());
    }
}
