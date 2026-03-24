import { ResponseVerification, UseCaseContext } from '@optivem/dsl-core/shared';
import { Converter, Decimal } from '@optivem/commons';
import { GetProductResponse } from '@optivem/driver-port/external/erp/dtos/GetProductResponse.js';
import { expect } from '@playwright/test';

export class GetProductVerification extends ResponseVerification<GetProductResponse> {
    constructor(response: GetProductResponse, context: UseCaseContext) {
        super(response, context);
    }

    sku(skuParamAlias: string): GetProductVerification {
        const expectedSku = this.context.getParamValue(skuParamAlias);
        const actualSku = this.response.sku;
        expect(
            actualSku,
            `Expected SKU to be '${expectedSku}', but was '${actualSku}'`
        ).toBe(expectedSku);
        return this;
    }

    price(expectedPrice: Decimal): GetProductVerification;
    price(expectedPrice: string): GetProductVerification;
    price(expectedPrice: Decimal | string): GetProductVerification {
        const decimal =
            typeof expectedPrice === 'string' ? Converter.toDecimal(expectedPrice)! : expectedPrice;
        const actualPrice = this.response.price;
        expect(
            actualPrice.eq(decimal),
            `Expected price to be ${decimal.toString()}, but was ${actualPrice.toString()}`
        ).toBe(true);
        return this;
    }
}


