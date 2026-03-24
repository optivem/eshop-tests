import { VoidVerification } from '@optivem/dsl-core/shared';
import type { UseCaseDsl } from '../../usecase/UseCaseDsl.js';
import { ExecutionResult } from '../ExecutionResult.js';
import { ExecutionResultBuilder } from '../ExecutionResultBuilder.js';
import { BaseWhenBuilder } from './BaseWhenStep.js';

/** When-builder for go-to-shop. */
export class GoToShopBuilder extends BaseWhenBuilder<void, VoidVerification> {
    constructor(app: UseCaseDsl) {
        super(app);
    }

    protected override async execute(
        app: UseCaseDsl
    ): Promise<ExecutionResult<void, VoidVerification>> {
        const result = await app.shop().goToShop().execute();
        return new ExecutionResultBuilder(result).build();
    }
}


