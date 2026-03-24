import type { Optional } from '@optivem/commons';
import { VoidVerification } from '@optivem/dsl-core/shared';
import type { UseCaseDsl } from '../../usecase/UseCaseDsl.js';
import { ExecutionResult } from '../ExecutionResult.js';
import { ExecutionResultBuilder } from '../ExecutionResultBuilder.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseWhenBuilder } from './BaseWhenStep.js';

export class CancelOrderBuilder extends BaseWhenBuilder<void, VoidVerification> {
    private orderNumberValue: Optional<string>;

    constructor(app: UseCaseDsl, setup?: () => Promise<void>) {
        super(app, setup);
        this.withOrderNumber(GherkinDefaults.DEFAULT_ORDER_NUMBER);
    }

    withOrderNumber(orderNumber: Optional<string>): this {
        this.orderNumberValue = orderNumber;
        return this;
    }

    protected override async execute(
        app: UseCaseDsl
    ): Promise<ExecutionResult<void, VoidVerification>> {
        const result = await app
            .shop()
            .cancelOrder()
            .orderNumber(this.orderNumberValue)
            .execute();

        return new ExecutionResultBuilder(result)
            .orderNumber(this.orderNumberValue)
            .build();
    }
}


