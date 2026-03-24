import type { Decimal } from '@optivem/commons';

export interface ExtCountryDetailsResponse {
    id?: string;
    countryName?: string;
    taxRate?: Decimal;
}
