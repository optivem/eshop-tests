import { Result, Closeable } from '@optivem/commons';
import type { GetTimeResponse } from './dtos/GetTimeResponse.js';
import type { ReturnsTimeRequest } from './dtos/ReturnsTimeRequest.js';
import type { ClockErrorResponse } from './dtos/error/ClockErrorResponse.js';

export interface ClockDriver extends Closeable {
	goToClock(): Promise<Result<void, ClockErrorResponse>>;
	getTime(): Promise<Result<GetTimeResponse, ClockErrorResponse>>;
	returnsTime(request: ReturnsTimeRequest): Promise<Result<void, ClockErrorResponse>>;
}
