import { Converter } from '@optivem/commons';
import type { Optional } from '@optivem/commons';
import type { UseCaseDsl } from '../../usecase/UseCaseDsl.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseGivenBuilder } from './BaseGivenStep.js';
import type { GivenClause } from './Given.js';

export class GivenProductBuilder extends BaseGivenBuilder {
    private sku: Optional<string>;
    private unitPrice: Optional<string>;

    constructor(givenClause: GivenClause) {
        super(givenClause);
        this.sku = GherkinDefaults.DEFAULT_SKU;
        this.unitPrice = GherkinDefaults.DEFAULT_UNIT_PRICE;
    }

    withSku(sku: Optional<string>): this {
        this.sku = sku;
        return this;
    }

    withUnitPrice(unitPrice: Optional<string>): this;
    withUnitPrice(unitPrice: number): this;
    withUnitPrice(unitPrice: Optional<string> | number): this {
        this.unitPrice = typeof unitPrice === 'number' ? Converter.fromDouble(unitPrice) : unitPrice;
        return this;
    }

    async execute(app: UseCaseDsl): Promise<void> {
        await app
            .erp()
            .returnsProduct()
            .sku(this.sku)
            .unitPrice(this.unitPrice)
            .execute()
            .then((r) => r.shouldSucceed());
    }
}
