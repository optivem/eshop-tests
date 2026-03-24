import { Result } from '@optivem/commons';
import { ExtGetTimeResponse } from './dtos/ExtGetTimeResponse.js';
import { ExtClockErrorResponse } from './dtos/error/ExtClockErrorResponse.js';

export class ClockRealClient {
    checkHealth(): Promise<Result<void, ExtClockErrorResponse>> {
        void this.now();
        return Promise.resolve(Result.success<void, ExtClockErrorResponse>());
    }

    getTime(): Promise<Result<ExtGetTimeResponse, ExtClockErrorResponse>> {
        const extResponse: ExtGetTimeResponse = {
            time: this.now().toISOString(),
        };
        return Promise.resolve(Result.success<ExtGetTimeResponse, ExtClockErrorResponse>(extResponse));
    }

    private now(): Date {
        return new Date();
    }
}
