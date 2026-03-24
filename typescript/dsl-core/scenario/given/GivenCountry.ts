import { Converter } from '@optivem/commons';
import type { Optional } from '@optivem/commons';
import type { UseCaseDsl } from '../../usecase/UseCaseDsl.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseGivenBuilder } from './BaseGivenStep.js';
import type { GivenClause } from './Given.js';

export class GivenCountryBuilder extends BaseGivenBuilder {
    private country: Optional<string>;
    private taxRate: Optional<string>;

    constructor(givenClause: GivenClause) {
        super(givenClause);
        this.country = GherkinDefaults.DEFAULT_COUNTRY;
        this.taxRate = GherkinDefaults.DEFAULT_TAX_RATE;
    }

    withCode(country: Optional<string>): this {
        this.country = country;
        return this;
    }

    withTaxRate(taxRate: Optional<string>): this;
    withTaxRate(taxRate: number): this;
    withTaxRate(taxRate: Optional<string> | number): this {
        this.taxRate = typeof taxRate === 'number' ? Converter.fromDouble(taxRate) : taxRate;
        return this;
    }

    async execute(app: UseCaseDsl): Promise<void> {
        await app
            .tax()
            .returnsTaxRate()
            .country(this.country)
            .taxRate(this.taxRate)
            .execute()
            .then((r) => r.shouldSucceed());
    }
}
