import type { Decimal } from '@optivem/commons';

export interface GetTaxResponse {
	country: string;
	taxRate: Decimal;
}
