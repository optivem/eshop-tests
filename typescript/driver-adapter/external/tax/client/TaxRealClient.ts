import { BaseTaxClient } from './BaseTaxClient.js';

export class TaxRealClient extends BaseTaxClient {
    constructor(baseUrl: string) {
        super(baseUrl);
    }
}
