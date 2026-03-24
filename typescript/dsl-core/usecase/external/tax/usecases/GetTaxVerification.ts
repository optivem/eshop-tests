import { ResponseVerification, UseCaseContext } from '@optivem/dsl-core/shared';
import { Converter, Decimal } from '@optivem/commons';
import type { GetTaxResponse } from '@optivem/driver-port/external/tax/dtos/GetTaxResponse.js';
import { expect } from '@playwright/test';

export class GetTaxVerification extends ResponseVerification<GetTaxResponse> {
    constructor(response: GetTaxResponse, context: UseCaseContext) {
        super(response, context);
    }

    country(expectedCountryAlias: string): GetTaxVerification {
        const expectedCountry = this.context.getParamValueOrLiteral(expectedCountryAlias);
        const actualCountry = this.response.country;
        expect(
            actualCountry,
            `Expected country to be '${expectedCountry}', but was '${actualCountry}'`
        ).toBe(expectedCountry);
        return this;
    }

    taxRate(expectedTaxRate: Decimal): GetTaxVerification;
    taxRate(expectedTaxRate: string): GetTaxVerification;
    taxRate(expectedTaxRate: number): GetTaxVerification;
    taxRate(expectedTaxRate: Decimal | string | number): GetTaxVerification {
        const decimalRate =
            typeof expectedTaxRate === 'string'
                ? Converter.toDecimal(expectedTaxRate)!
                : typeof expectedTaxRate === 'number'
                  ? Converter.toDecimalFromNumber(expectedTaxRate)
                  : expectedTaxRate;
        const actualTaxRate = this.response.taxRate;
        expect(
            actualTaxRate.eq(decimalRate),
            `Expected tax rate to be ${decimalRate.toString()}, but was ${actualTaxRate.toString()}`
        ).toBe(true);
        return this;
    }

    taxRateIsPositive(): GetTaxVerification {
        const actualTaxRate = this.response.taxRate;
        const n = actualTaxRate.toNumber();
        expect(n, `Expected tax rate to be positive, but was ${actualTaxRate.toString()}`).toBeGreaterThan(0);
        return this;
    }
}


