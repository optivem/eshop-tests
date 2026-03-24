import type { GetTaxResponse } from '@optivem/driver-port/external/tax/dtos/GetTaxResponse.js';
import type { ExtCountryDetailsResponse } from '../client/dtos/ExtCountryDetailsResponse.js';

export function from(ext: ExtCountryDetailsResponse): GetTaxResponse {
    return {
        country: ext.id ?? '',
        taxRate: ext.taxRate!,
    };
}
