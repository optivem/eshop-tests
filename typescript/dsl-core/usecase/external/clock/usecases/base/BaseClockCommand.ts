import type { ClockDriver } from '@optivem/driver-port/external/clock/ClockDriver.js';
import { BaseUseCase, UseCaseContext } from '@optivem/dsl-core/shared';
import { ClockErrorResponse } from '@optivem/driver-port/external/clock/dtos/error/ClockErrorResponse.js';
import { ClockErrorVerification } from './ClockErrorVerification.js';

export abstract class BaseClockCommand<TResponse, TVerification> extends BaseUseCase<
    ClockDriver,
    TResponse,
    ClockErrorResponse,
    TVerification,
    ClockErrorVerification
> {
    protected constructor(driver: ClockDriver, context: UseCaseContext) {
        super(driver, context);
    }
}


