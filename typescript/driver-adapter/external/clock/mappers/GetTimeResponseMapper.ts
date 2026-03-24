import type { GetTimeResponse } from '@optivem/driver-port/external/clock/dtos/GetTimeResponse.js';
import type { ExtGetTimeResponse } from '../client/dtos/ExtGetTimeResponse.js';

export function from(response: ExtGetTimeResponse): GetTimeResponse {
    return {
        time: new Date(response.time),
    };
}
