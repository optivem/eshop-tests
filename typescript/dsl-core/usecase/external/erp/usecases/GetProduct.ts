import { UseCaseContext } from '@optivem/dsl-core/shared';
import type { Optional } from '@optivem/commons';
import type { ErpDriver } from '@optivem/driver-port/external/erp/ErpDriver.js';
import type { GetProductRequest } from '@optivem/driver-port/external/erp/dtos/GetProductRequest.js';
import type { GetProductResponse } from '@optivem/driver-port/external/erp/dtos/GetProductResponse.js';
import { BaseErpCommand } from './base/BaseErpCommand.js';
import { ErpUseCaseResult } from './base/ErpUseCaseResult.js';
import { GetProductVerification } from './GetProductVerification.js';

export class GetProduct extends BaseErpCommand<GetProductResponse, GetProductVerification> {
    private skuParamAlias: Optional<string>;

    constructor(driver: ErpDriver, context: UseCaseContext) {
        super(driver, context);
    }

    sku(alias: Optional<string>): GetProduct {
        this.skuParamAlias = alias;
        return this;
    }

    async execute(): Promise<ErpUseCaseResult<GetProductResponse, GetProductVerification>> {
        const sku = this.context.getParamValue(this.skuParamAlias as string);
        const request: GetProductRequest = { sku };
        const result = await this.driver.getProduct(request);
        return new ErpUseCaseResult<GetProductResponse, GetProductVerification>(
            result,
            this.context,
            (response, ctx) => new GetProductVerification(response, ctx)
        );
    }
}


