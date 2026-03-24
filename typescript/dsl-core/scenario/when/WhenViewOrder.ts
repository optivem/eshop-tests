import type { Optional } from '@optivem/commons';
import type { UseCaseDsl } from '../../usecase/UseCaseDsl.js';
import { ExecutionResult } from '../ExecutionResult.js';
import { ExecutionResultBuilder } from '../ExecutionResultBuilder.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseWhenBuilder } from './BaseWhenStep.js';
import type { ViewOrderResponse } from '@optivem/driver-port/shop/dtos/index.js';
import type { ViewOrderVerification } from '../../usecase/shop/usecases/ViewOrderVerification.js';

export class ViewOrderBuilder extends BaseWhenBuilder<ViewOrderResponse, ViewOrderVerification> {
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
    ): Promise<ExecutionResult<ViewOrderResponse, ViewOrderVerification>> {
        const result = await app
            .shop()
            .viewOrder()
            .orderNumber(this.orderNumberValue)
            .execute();

        return new ExecutionResultBuilder(result).orderNumber(this.orderNumberValue).build();
    }
}


