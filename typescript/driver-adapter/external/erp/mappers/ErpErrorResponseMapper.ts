import type { ErpErrorResponse } from '@optivem/driver-port/external/erp/dtos/error/ErpErrorResponse.js';
import type { ExtErpErrorResponse } from '../client/dtos/error/ExtErpErrorResponse.js';

export function from(ext: ExtErpErrorResponse): ErpErrorResponse {
    return { message: ext.message };
}
