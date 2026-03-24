import { Result } from '@optivem/commons';
import { HttpStatus } from '@optivem/driver-adapter/client/http';
import { JsonWireMockClient } from '@optivem/driver-adapter/client/wiremock';
import { BaseErpClient } from './BaseErpClient.js';
import type { ExtProductDetailsResponse } from './dtos/ExtProductDetailsResponse.js';
import { from as toExtErpErrorResponse } from './dtos/error/ExtErpErrorResponse.js';
import type { ExtErpErrorResponse } from './dtos/error/ExtErpErrorResponse.js';

export class ErpStubClient extends BaseErpClient {
    private static readonly ERP_PRODUCTS_ENDPOINT = '/erp/api/products';

    private readonly wireMockClient: JsonWireMockClient;

    constructor(baseUrl: string) {
        super(baseUrl);
        this.wireMockClient = new JsonWireMockClient(baseUrl);
    }

    configureGetProduct(response: ExtProductDetailsResponse): Promise<Result<void, ExtErpErrorResponse>> {
        const path = `${ErpStubClient.ERP_PRODUCTS_ENDPOINT}/${response.id}`;
        return this.wireMockClient.stubGet(path, HttpStatus.OK, response).then((r) => r.mapError(toExtErpErrorResponse));
    }
}



