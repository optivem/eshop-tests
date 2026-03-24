import { Result } from '@optivem/commons';
import { ErpRealClient } from './client/ErpRealClient.js';
import type { ExtCreateProductRequest } from './client/dtos/ExtCreateProductRequest.js';
import type { ErpErrorResponse } from '@optivem/driver-port/external/erp/dtos/error/ErpErrorResponse.js';
import type { ReturnsProductRequest } from '@optivem/driver-port/external/erp/dtos/ReturnsProductRequest.js';
import { from as fromErpErrorResponse } from './mappers/ErpErrorResponseMapper.js';
import { BaseErpDriver } from './BaseErpDriver.js';

export class ErpRealDriver extends BaseErpDriver<ErpRealClient> {
    private static readonly DEFAULT_TITLE = 'Test Product Title';
    private static readonly DEFAULT_DESCRIPTION = 'Test Product Description';
    private static readonly DEFAULT_CATEGORY = 'Test Category';
    private static readonly DEFAULT_BRAND = 'Test Brand';

    constructor(baseUrl: string) {
        super(new ErpRealClient(baseUrl));
    }

    returnsProduct(request: ReturnsProductRequest): Promise<Result<void, ErpErrorResponse>> {
        const extRequest: ExtCreateProductRequest = {
            id: request.sku,
            title: ErpRealDriver.DEFAULT_TITLE,
            description: ErpRealDriver.DEFAULT_DESCRIPTION,
            category: ErpRealDriver.DEFAULT_CATEGORY,
            brand: ErpRealDriver.DEFAULT_BRAND,
            price: request.price,
        };
        return this.client.createProduct(extRequest).then(async (r) => {
            if (r.isSuccess()) return r.mapError(fromErpErrorResponse);
            // If duplicate key, update the existing product (PUT)
            const err = r.getError();
            const errStr = JSON.stringify(err);
            if (errStr.includes('duplicate') || errStr.includes('Insert failed') || errStr.includes('already')) {
                return this.client.updateProduct(request.sku!, extRequest).then((ur) => ur.mapError(fromErpErrorResponse));
            }
            return r.mapError(fromErpErrorResponse);
        });
    }
}
