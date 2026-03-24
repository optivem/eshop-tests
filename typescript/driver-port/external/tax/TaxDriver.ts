import type { Optional, Result } from '@optivem/commons';
import type { GetTaxResponse } from './dtos/GetTaxResponse.js';
import type { ReturnsTaxRateRequest } from './dtos/ReturnsTaxRateRequest.js';
import type { TaxErrorResponse } from './dtos/error/TaxErrorResponse.js';

export interface TaxDriver {
	goToTax(): Promise<Result<void, TaxErrorResponse>>;
	getTaxRate(country: Optional<string>): Promise<Result<GetTaxResponse, TaxErrorResponse>>;
	returnsTaxRate(request: ReturnsTaxRateRequest): Promise<Result<void, TaxErrorResponse>>;
	close(): void;
}
