import { ResponseVerification, UseCaseContext } from '@optivem/dsl-core/shared';
import { Converter } from '@optivem/commons';
import { GetTimeResponse } from '@optivem/driver-port/external/clock/dtos/GetTimeResponse.js';
import { expect } from '@playwright/test';

export class GetTimeVerification extends ResponseVerification<GetTimeResponse> {
    constructor(response: GetTimeResponse, context: UseCaseContext) {
        super(response, context);
    }

    timeIsNotNull(): GetTimeVerification {
        expect(this.response.time, 'Time should not be null or default').not.toBeFalsy();
        expect(this.response.time.getTime(), 'Time should be a valid date').not.toBe(NaN);
        return this;
    }

    time(expectedTime: Date): GetTimeVerification;
    time(expectedTimeString: string): GetTimeVerification;
    time(expectedTimeOrString: Date | string): GetTimeVerification {
        const expectedTime = typeof expectedTimeOrString === 'string'
            ? Converter.toDate(expectedTimeOrString)
            : expectedTimeOrString;
        if (expectedTime === null) {
            throw new Error(`Invalid date format: ${expectedTimeOrString}`);
        }
        const actual = this.response.time.getTime();
        const expected = expectedTime.getTime();
        expect(actual, `Expected time: ${expectedTime.toISOString()}, but got: ${this.response.time.toISOString()}`).toBe(expected);
        return this;
    }

    timeIsAfter(time: Date): GetTimeVerification;
    timeIsAfter(timeString: string): GetTimeVerification;
    timeIsAfter(timeOrString: Date | string): GetTimeVerification {
        const time = typeof timeOrString === 'string' ? Converter.toDate(timeOrString) : timeOrString;
        if (time === null) throw new Error(`Invalid date format: ${timeOrString}`);
        const actual = this.response.time.getTime();
        const threshold = time.getTime();
        expect(actual, `Expected time to be after ${time.toISOString()}, but was ${this.response.time.toISOString()}`).toBeGreaterThan(threshold);
        return this;
    }

    timeIsBefore(time: Date): GetTimeVerification;
    timeIsBefore(timeString: string): GetTimeVerification;
    timeIsBefore(timeOrString: Date | string): GetTimeVerification {
        const time = typeof timeOrString === 'string' ? Converter.toDate(timeOrString) : timeOrString;
        if (time === null) throw new Error(`Invalid date format: ${timeOrString}`);
        const actual = this.response.time.getTime();
        const threshold = time.getTime();
        expect(actual, `Expected time to be before ${time.toISOString()}, but was ${this.response.time.toISOString()}`).toBeLessThan(threshold);
        return this;
    }

    timeIsBetween(start: Date, end: Date): GetTimeVerification;
    timeIsBetween(startString: string, endString: string): GetTimeVerification;
    timeIsBetween(startOrString: Date | string, endOrString: Date | string): GetTimeVerification {
        const start = typeof startOrString === 'string' ? Converter.toDate(startOrString) : startOrString;
        const end = typeof endOrString === 'string' ? Converter.toDate(endOrString) : endOrString;
        if (start === null) throw new Error(`Invalid date format: ${startOrString}`);
        if (end === null) throw new Error(`Invalid date format: ${endOrString}`);
        const actual = this.response.time.getTime();
        const startMs = start.getTime();
        const endMs = end.getTime();
        expect(actual, `Expected time to be at or after ${start.toISOString()}, but was ${this.response.time.toISOString()}`).toBeGreaterThanOrEqual(startMs);
        expect(actual, `Expected time to be at or before ${end.toISOString()}, but was ${this.response.time.toISOString()}`).toBeLessThanOrEqual(endMs);
        return this;
    }
}


