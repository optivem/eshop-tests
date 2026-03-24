import type { ResponseVerification } from '@optivem/dsl-core/shared';
import type { Optional } from '@optivem/commons';
import type { ShopUseCaseResult } from '../usecase/shop/usecases/base/ShopUseCaseResult.js';
import { ExecutionResult } from './ExecutionResult.js';

export class ExecutionResultBuilder<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> {
    private orderNumberValue: Optional<string>;
    private couponCodeValue: Optional<string>;

    constructor(private readonly result: ShopUseCaseResult<TSuccessResponse, TSuccessVerification>) {}

    orderNumber(value: Optional<string>): this {
        this.orderNumberValue = value;
        return this;
    }

    couponCode(value: Optional<string>): this {
        this.couponCodeValue = value;
        return this;
    }

    build(): ExecutionResult<TSuccessResponse, TSuccessVerification> {
        return new ExecutionResult(this.result, this.orderNumberValue, this.couponCodeValue);
    }
}


