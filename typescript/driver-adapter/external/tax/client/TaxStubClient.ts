import { Result } from '@optivem/commons';
import { HttpStatus } from '@optivem/driver-adapter/client/http';
import { JsonWireMockClient } from '@optivem/driver-adapter/client/wiremock';
import { BaseTaxClient } from './BaseTaxClient.js';
import type { ExtCountryDetailsResponse } from './dtos/ExtCountryDetailsResponse.js';
import { from as toExtTaxErrorResponse } from './dtos/error/ExtTaxErrorResponse.js';
import type { ExtTaxErrorResponse } from './dtos/error/ExtTaxErrorResponse.js';

export class TaxStubClient extends BaseTaxClient {
    protected static readonly COUNTRIES_ENDPOINT = '/tax/api/countries';

    private readonly wireMockClient: JsonWireMockClient;

    constructor(baseUrl: string) {
        super(baseUrl);
        this.wireMockClient = new JsonWireMockClient(baseUrl);
    }

    configureGetCountry(response: ExtCountryDetailsResponse): Promise<Result<void, ExtTaxErrorResponse>> {
        const country = response.id;
        const path = `${TaxStubClient.COUNTRIES_ENDPOINT}/${country}`;
        return this.wireMockClient.stubGet(path, HttpStatus.OK, response).then((r) => r.mapError(toExtTaxErrorResponse));
    }
}



