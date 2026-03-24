import { Result } from '@optivem/commons';
import { UseCaseResult, UseCaseContext, ResponseVerification } from '@optivem/dsl-core/shared';
import { ClockErrorResponse } from '@optivem/driver-port/external/clock/dtos/error/ClockErrorResponse.js';
import { ClockErrorVerification } from './ClockErrorVerification.js';

export class ClockUseCaseResult<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> extends UseCaseResult<TSuccessResponse, ClockErrorResponse, TSuccessVerification, ClockErrorVerification> {
    constructor(
        result: Result<TSuccessResponse, ClockErrorResponse>,
        context: UseCaseContext,
        verificationFactory: (response: TSuccessResponse, context: UseCaseContext) => TSuccessVerification
    ) {
        super(result, context, verificationFactory, (error, ctx) => new ClockErrorVerification(error, ctx));
    }
}


