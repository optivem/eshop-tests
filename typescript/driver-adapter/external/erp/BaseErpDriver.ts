import { Result } from '@optivem/commons';
import type { BaseErpClient } from './client/BaseErpClient.js';
import type { ErpDriver } from '@optivem/driver-port/external/erp/ErpDriver.js';
import type { ErpErrorResponse } from '@optivem/driver-port/external/erp/dtos/error/ErpErrorResponse.js';
import type { GetProductRequest } from '@optivem/driver-port/external/erp/dtos/GetProductRequest.js';
import type { GetProductResponse } from '@optivem/driver-port/external/erp/dtos/GetProductResponse.js';
import type { ReturnsProductRequest } from '@optivem/driver-port/external/erp/dtos/ReturnsProductRequest.js';
import { from as fromGetProductResponse } from './mappers/GetProductResponseMapper.js';
import { from as fromErpErrorResponse } from './mappers/ErpErrorResponseMapper.js';

export abstract class BaseErpDriver<TClient extends BaseErpClient> implements ErpDriver {
    protected readonly client: TClient;

    protected constructor(client: TClient) {
        this.client = client;
    }

    goToErp(): Promise<Result<void, ErpErrorResponse>> {
        return this.client.checkHealth().then((r) => r.mapError(fromErpErrorResponse));
    }

    getProduct(request: GetProductRequest): Promise<Result<GetProductResponse, ErpErrorResponse>> {
        return this.client
            .getProduct(request.sku)
            .then((r) => r.map(fromGetProductResponse).mapError(fromErpErrorResponse));
    }

    abstract returnsProduct(request: ReturnsProductRequest): Promise<Result<void, ErpErrorResponse>>;
}
