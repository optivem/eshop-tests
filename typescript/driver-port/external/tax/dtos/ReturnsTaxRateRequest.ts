import type { Optional } from '@optivem/commons';

export interface ReturnsTaxRateRequest {
	country?: Optional<string>;
	taxRate?: Optional<string>;
}
