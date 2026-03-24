import { Result, Converter } from '@optivem/commons';
import { ErpStubClient } from './client/ErpStubClient.js';
import type { ExtProductDetailsResponse } from './client/dtos/ExtProductDetailsResponse.js';
import type { ErpErrorResponse } from '@optivem/driver-port/external/erp/dtos/error/ErpErrorResponse.js';
import type { ReturnsProductRequest } from '@optivem/driver-port/external/erp/dtos/ReturnsProductRequest.js';
import { from as fromErpErrorResponse } from './mappers/ErpErrorResponseMapper.js';
import { BaseErpDriver } from './BaseErpDriver.js';

export class ErpStubDriver extends BaseErpDriver<ErpStubClient> {
    constructor(baseUrl: string) {
        super(new ErpStubClient(baseUrl));
    }

    returnsProduct(request: ReturnsProductRequest): Promise<Result<void, ErpErrorResponse>> {
        const extResponse: ExtProductDetailsResponse = {
            id: request.sku!,
            title: '',
            description: '',
            price: Converter.toDecimal(request.price!)!,
            category: '',
            brand: '',
        };
        return this.client.configureGetProduct(extResponse).then((r) => r.mapError(fromErpErrorResponse));
    }
}
