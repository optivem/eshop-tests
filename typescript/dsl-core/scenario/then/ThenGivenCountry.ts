import type { ThenGivenClockPort, ThenGivenProductPort, ThenGivenCountryPort } from '@optivem/dsl-port/scenario/ScenarioDslPort.js';
import type { GetTaxVerification } from '../../usecase/external/tax/usecases/GetTaxVerification.js';
import type { UseCaseDsl } from '../../usecase/UseCaseDsl.js';

export class ThenGivenCountry implements ThenGivenCountryPort {
    constructor(
        private readonly app: UseCaseDsl,
        private readonly verification: GetTaxVerification
    ) {}

    hasCountry(country: string): ThenGivenCountryPort {
        this.verification.country(country);
        return this;
    }

    hasTaxRate(taxRate: number): ThenGivenCountryPort {
        this.verification.taxRate(taxRate);
        return this;
    }

    hasTaxRateIsPositive(): ThenGivenCountryPort {
        this.verification.taxRateIsPositive();
        return this;
    }

    async clock(): Promise<ThenGivenClockPort> {
        const { ThenGivenClock } = await import('./ThenGivenClock.js');
        const verification = (await this.app.clock().getTime().execute()).shouldSucceed();
        return new ThenGivenClock(this.app, verification);
    }

    async product(skuAlias: string): Promise<ThenGivenProductPort> {
        const { ThenGivenProduct } = await import('./ThenGivenProduct.js');
        const verification = (await this.app.erp().getProduct().sku(skuAlias).execute()).shouldSucceed();
        return new ThenGivenProduct(this.app, verification);
    }

    async country(countryAlias: string): Promise<ThenGivenCountryPort> {
        const verification = (await this.app.tax().getTaxRate().country(countryAlias).execute()).shouldSucceed();
        return new ThenGivenCountry(this.app, verification);
    }
}
