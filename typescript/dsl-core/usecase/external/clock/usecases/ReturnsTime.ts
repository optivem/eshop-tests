import type { ClockDriver } from '@optivem/driver-port/external/clock/ClockDriver.js';
import type { ReturnsTimeRequest } from '@optivem/driver-port/external/clock/dtos/ReturnsTimeRequest.js';
import { BaseClockCommand } from './base/BaseClockCommand.js';
import { ClockUseCaseResult } from './base/ClockUseCaseResult.js';
import { VoidVerification } from '@optivem/dsl-core/shared';
import { UseCaseContext } from '@optivem/dsl-core/shared';
import type { Optional } from '@optivem/commons';

export class ReturnsTime extends BaseClockCommand<void, VoidVerification> {
    private timeValue: Optional<string>;

    constructor(driver: ClockDriver, context: UseCaseContext) {
        super(driver, context);
    }

    time(value: Optional<string>): ReturnsTime {
        this.timeValue = value;
        return this;
    }

    async execute(): Promise<ClockUseCaseResult<void, VoidVerification>> {
        const request: ReturnsTimeRequest = { time: this.timeValue };
        const result = await this.driver.returnsTime(request);
        return new ClockUseCaseResult<void, VoidVerification>(
            result,
            this.context,
            (response, ctx) => new VoidVerification(response, ctx)
        );
    }
}


