import { Result } from '@optivem/commons';
import type { ErpErrorResponse } from './dtos/error/ErpErrorResponse.js';
import type { GetProductRequest } from './dtos/GetProductRequest.js';
import type { GetProductResponse } from './dtos/GetProductResponse.js';
import type { ReturnsProductRequest } from './dtos/ReturnsProductRequest.js';

export interface ErpDriver {
	goToErp(): Promise<Result<void, ErpErrorResponse>>;
	getProduct(request: GetProductRequest): Promise<Result<GetProductResponse, ErpErrorResponse>>;
	returnsProduct(request: ReturnsProductRequest): Promise<Result<void, ErpErrorResponse>>;
}
