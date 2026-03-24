import { ResponseVerification, UseCaseContext } from '@optivem/dsl-core/shared';
import type { PlaceOrderResponse } from '../commons/dtos/index.js';
import { expect } from '@playwright/test';

export class PlaceOrderVerification extends ResponseVerification<PlaceOrderResponse> {
    constructor(response: PlaceOrderResponse, context: UseCaseContext) {
        super(response, context);
    }

    orderNumber(orderNumberResultAlias: string): PlaceOrderVerification {
        const expectedOrderNumber = this.context.getResultValue(orderNumberResultAlias);
        const actualOrderNumber = this.response.orderNumber;
        expect(actualOrderNumber, `Expected order number to be '${expectedOrderNumber}', but was '${actualOrderNumber}'`)
            .toBe(expectedOrderNumber);
        return this;
    }

    orderNumberStartsWith(prefix: string): PlaceOrderVerification {
        const actualOrderNumber = this.response.orderNumber;
        expect(actualOrderNumber, `Expected order number to start with '${prefix}', but was '${actualOrderNumber}'`)
            .toMatch(new RegExp(`^${prefix}`));
        return this;
    }
}






