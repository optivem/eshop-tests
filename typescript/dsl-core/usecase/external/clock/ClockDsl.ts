import { UseCaseContext } from '@optivem/dsl-core/shared';
import { ExternalSystemMode } from '@optivem/dsl-port/ExternalSystemMode.js';
import type { ClockDriver } from '@optivem/driver-port/external/clock/ClockDriver.js';
import { ClockStubDriver } from '@optivem/driver-adapter/external/clock/ClockStubDriver.js';
import { ClockRealDriver } from '@optivem/driver-adapter/external/clock/ClockRealDriver.js';
import { Closer } from '@optivem/commons';
import { GoToClock } from './usecases/GoToClock.js';
import { ReturnsTime } from './usecases/ReturnsTime.js';
import { GetTime } from './usecases/GetTime.js';

export class ClockDsl {
    private readonly driver: ClockDriver;
    private readonly context: UseCaseContext;

    constructor(baseUrl: string, context: UseCaseContext) {
        this.context = context;
        this.driver = ClockDsl.createDriver(baseUrl, context);
    }

    private static createDriver(baseUrl: string, context: UseCaseContext): ClockDriver {
        const mode = context.getExternalSystemMode();
        switch (mode) {
            case ExternalSystemMode.REAL:
                return new ClockRealDriver();
            case ExternalSystemMode.STUB:
                return new ClockStubDriver(baseUrl);
            default:
                throw new Error(`External system mode '${mode}' is not supported for ClockDsl.`);
        }
    }

    async close(): Promise<void> {
        await Closer.close(this.driver);
    }

    goToClock(): GoToClock {
        return new GoToClock(this.driver, this.context);
    }

    returnsTime(): ReturnsTime {
        return new ReturnsTime(this.driver, this.context);
    }

    getTime(): GetTime {
        return new GetTime(this.driver, this.context);
    }
}


