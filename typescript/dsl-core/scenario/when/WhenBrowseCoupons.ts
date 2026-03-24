import type { UseCaseDsl } from '../../usecase/UseCaseDsl.js';
import { ExecutionResult } from '../ExecutionResult.js';
import { ExecutionResultBuilder } from '../ExecutionResultBuilder.js';
import { BaseWhenBuilder } from './BaseWhenStep.js';
import type { BrowseCouponsResponse } from '@optivem/driver-port/shop/dtos/index.js';
import type { BrowseCouponsVerification } from '../../usecase/shop/usecases/BrowseCouponsVerification.js';

export class BrowseCouponsBuilder extends BaseWhenBuilder<BrowseCouponsResponse, BrowseCouponsVerification> {
    constructor(app: UseCaseDsl) {
        super(app);
    }

    protected override async execute(
        app: UseCaseDsl
    ): Promise<ExecutionResult<BrowseCouponsResponse, BrowseCouponsVerification>> {
        const result = await app
            .shop()
            .browseCoupons()
            .execute();

        return new ExecutionResultBuilder(result).build();
    }
}


