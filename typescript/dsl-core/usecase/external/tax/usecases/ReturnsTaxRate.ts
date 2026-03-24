import { VoidVerification, UseCaseContext } from '@optivem/dsl-core/shared';
import { Converter } from '@optivem/commons';
import type { Optional } from '@optivem/commons';
import type { TaxDriver } from '@optivem/driver-port/external/tax/TaxDriver.js';
import type { ReturnsTaxRateRequest } from '@optivem/driver-port/external/tax/dtos/ReturnsTaxRateRequest.js';
import { BaseTaxCommand } from './base/BaseTaxCommand.js';
import { TaxUseCaseResult } from './base/TaxUseCaseResult.js';

export class ReturnsTaxRate extends BaseTaxCommand<void, VoidVerification> {
    private countryAlias: Optional<string>;
    private taxRateValue: Optional<string>;

    constructor(driver: TaxDriver, context: UseCaseContext) {
        super(driver, context);
    }

    country(countryAlias: Optional<string>): ReturnsTaxRate {
        this.countryAlias = countryAlias;
        return this;
    }

    taxRate(taxRate: Optional<string | number>): ReturnsTaxRate {
        this.taxRateValue = taxRate === undefined || taxRate === null ? undefined : typeof taxRate === 'number' ? Converter.fromDouble(taxRate) : taxRate;
        return this;
    }

    async execute(): Promise<TaxUseCaseResult<void, VoidVerification>> {
        const country = this.context.getParamValueOrLiteral(this.countryAlias);
        const request: ReturnsTaxRateRequest = {
            country,
            taxRate: this.taxRateValue,
        };
        const result = await this.driver.returnsTaxRate(request);
        return new TaxUseCaseResult(result, this.context, (response, ctx) => new VoidVerification(response, ctx));
    }
}


