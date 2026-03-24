import { Result, Converter } from '@optivem/commons';
import { TaxStubClient } from './client/TaxStubClient.js';
import type { ExtCountryDetailsResponse } from './client/dtos/ExtCountryDetailsResponse.js';
import type { ReturnsTaxRateRequest } from '@optivem/driver-port/external/tax/dtos/ReturnsTaxRateRequest.js';
import type { TaxErrorResponse } from '@optivem/driver-port/external/tax/dtos/error/TaxErrorResponse.js';
import { from as fromTaxErrorResponse } from './mappers/TaxErrorResponseMapper.js';
import { BaseTaxDriver } from './BaseTaxDriver.js';

export class TaxStubDriver extends BaseTaxDriver<TaxStubClient> {
    constructor(baseUrl: string) {
        super(new TaxStubClient(baseUrl));
    }

    returnsTaxRate(request: ReturnsTaxRateRequest): Promise<Result<void, TaxErrorResponse>> {
        const country = request.country!;
        const taxRate = Converter.toDecimal(request.taxRate!)!;
        const response: ExtCountryDetailsResponse = {
            id: country,
            countryName: country,
            taxRate,
        };
        return this.client.configureGetCountry(response).then((r) => r.mapError(fromTaxErrorResponse));
    }
}
