import type { Optional } from '@optivem/commons';
import { Result } from '@optivem/commons';
import { JsonHttpClient } from '@optivem/driver-adapter/client/http';
import type { ExtCountryDetailsResponse } from './dtos/ExtCountryDetailsResponse.js';
import type { ExtTaxErrorResponse } from './dtos/error/ExtTaxErrorResponse.js';

export abstract class BaseTaxClient {
    protected static readonly HEALTH_ENDPOINT: string = '/health';
    protected static readonly COUNTRIES_ENDPOINT: string = '/api/countries';

    protected readonly httpClient: JsonHttpClient<ExtTaxErrorResponse>;

    protected constructor(baseUrl: string) {
        this.httpClient = new JsonHttpClient<ExtTaxErrorResponse>(baseUrl);
    }

    checkHealth(): Promise<Result<void, ExtTaxErrorResponse>> {
        return this.httpClient.getAsync<void>(BaseTaxClient.HEALTH_ENDPOINT);
    }

    getCountry(country: Optional<string>): Promise<Result<ExtCountryDetailsResponse, ExtTaxErrorResponse>> {
        return this.httpClient.getAsync<ExtCountryDetailsResponse>(
            `${BaseTaxClient.COUNTRIES_ENDPOINT}/${country}`,
        );
    }
}



