import { Result } from '@optivem/commons';
import { BaseErpClient } from './BaseErpClient.js';
import type { ExtCreateProductRequest } from './dtos/ExtCreateProductRequest.js';
import type { ExtErpErrorResponse } from './dtos/error/ExtErpErrorResponse.js';

export class ErpRealClient extends BaseErpClient {
    constructor(baseUrl: string) {
        super(baseUrl);
    }

    createProduct(request: ExtCreateProductRequest): Promise<Result<void, ExtErpErrorResponse>> {
        return this.httpClient.postAsync<void>(BaseErpClient.PRODUCTS_ENDPOINT, request);
    }
}
