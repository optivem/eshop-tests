import { ResponseVerification, UseCaseContext } from '@optivem/dsl-core/shared';
import { ClockErrorResponse } from '@optivem/driver-port/external/clock/dtos/error/ClockErrorResponse.js';

export class ClockErrorVerification extends ResponseVerification<ClockErrorResponse> {
    constructor(error: ClockErrorResponse, context: UseCaseContext) {
        super(error, context);
    }
}


