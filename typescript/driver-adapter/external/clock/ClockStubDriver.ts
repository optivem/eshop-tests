import { ClockStubClient } from './client/ClockStubClient.js';
import type { GetTimeResponse } from '@optivem/driver-port/external/clock/dtos/GetTimeResponse.js';
import type { ReturnsTimeRequest } from '@optivem/driver-port/external/clock/dtos/ReturnsTimeRequest.js';
import type { ClockErrorResponse } from '@optivem/driver-port/external/clock/dtos/error/ClockErrorResponse.js';
import { ExtGetTimeResponse } from './client/dtos/ExtGetTimeResponse.js';
import { Result } from '@optivem/commons';
import type { ClockDriver } from '@optivem/driver-port/external/clock/ClockDriver.js';
import { from as fromGetTimeResponse } from './mappers/GetTimeResponseMapper.js';
import { from as fromClockErrorResponse } from './mappers/ClockErrorResponseMapper.js';

export class ClockStubDriver implements ClockDriver {
    private readonly client: ClockStubClient;

    constructor(baseUrl: string) {
        this.client = new ClockStubClient(baseUrl);
    }

    close(): void {
        // No resources to dispose
    }

    async goToClock(): Promise<Result<void, ClockErrorResponse>> {
        return this.client.checkHealth().then((r) => r.mapError(fromClockErrorResponse));
    }

    async getTime(): Promise<Result<GetTimeResponse, ClockErrorResponse>> {
        return this.client.getTime().then((r) => r.map(fromGetTimeResponse).mapError(fromClockErrorResponse));
    }

    async returnsTime(request: ReturnsTimeRequest): Promise<Result<void, ClockErrorResponse>> {
        const extResponse: ExtGetTimeResponse = { time: request.time ?? '' };
        return this.client.configureGetTime(extResponse).then((r) => r.mapError(fromClockErrorResponse));
    }
}
