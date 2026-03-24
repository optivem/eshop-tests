import { Result } from '@optivem/commons';
import type { Optional } from '@optivem/commons';
import { JsonHttpClient } from '@optivem/driver-adapter/client/http';
import type { ExtProductDetailsResponse } from './dtos/ExtProductDetailsResponse.js';
import type { ExtCreateProductRequest } from './dtos/ExtCreateProductRequest.js';
import type { ExtErpErrorResponse } from './dtos/error/ExtErpErrorResponse.js';

export abstract class BaseErpClient {
    protected static readonly HEALTH_ENDPOINT = '/health';
    protected static readonly PRODUCTS_ENDPOINT = '/api/products';

    protected readonly httpClient: JsonHttpClient<ExtErpErrorResponse>;

    protected constructor(baseUrl: string) {
        this.httpClient = new JsonHttpClient<ExtErpErrorResponse>(baseUrl);
    }

    checkHealth(): Promise<Result<void, ExtErpErrorResponse>> {
        return this.httpClient.getAsync<void>(BaseErpClient.HEALTH_ENDPOINT);
    }

    getProduct(sku: Optional<string>): Promise<Result<ExtProductDetailsResponse, ExtErpErrorResponse>> {
        return this.httpClient.getAsync<ExtProductDetailsResponse>(`${BaseErpClient.PRODUCTS_ENDPOINT}/${sku}`,);
    }

    updateProduct(sku: string, request: ExtCreateProductRequest): Promise<Result<void, ExtErpErrorResponse>> {
        return this.httpClient.putAsync<void>(`${BaseErpClient.PRODUCTS_ENDPOINT}/${sku}`, request);
    }
}



