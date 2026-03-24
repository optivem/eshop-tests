import type { ClockDriver } from '@optivem/driver-port/external/clock/ClockDriver.js';
import type { GetTimeResponse } from '@optivem/driver-port/external/clock/dtos/GetTimeResponse.js';
import { BaseClockCommand } from './base/BaseClockCommand.js';
import { ClockUseCaseResult } from './base/ClockUseCaseResult.js';
import { GetTimeVerification } from './GetTimeVerification.js';
import { UseCaseContext } from '@optivem/dsl-core/shared';

export class GetTime extends BaseClockCommand<GetTimeResponse, GetTimeVerification> {
    constructor(driver: ClockDriver, context: UseCaseContext) {
        super(driver, context);
    }

    async execute(): Promise<ClockUseCaseResult<GetTimeResponse, GetTimeVerification>> {
        const result = await this.driver.getTime();
        return new ClockUseCaseResult<GetTimeResponse, GetTimeVerification>(
            result,
            this.context,
            (response, ctx) => new GetTimeVerification(response, ctx)
        );
    }
}


