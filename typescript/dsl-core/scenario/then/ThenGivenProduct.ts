import type { ThenGivenClockPort, ThenGivenProductPort, ThenGivenCountryPort } from '@optivem/dsl-port/scenario/ScenarioDslPort.js';
import type { GetProductVerification } from '../../usecase/external/erp/usecases/GetProductVerification.js';
import type { UseCaseDsl } from '../../usecase/UseCaseDsl.js';

export class ThenGivenProduct implements ThenGivenProductPort {
    constructor(
        private readonly app: UseCaseDsl,
        private readonly verification: GetProductVerification
    ) {}

    hasSku(sku: string): ThenGivenProductPort {
        this.verification.sku(sku);
        return this;
    }

    hasPrice(price: number): ThenGivenProductPort {
        this.verification.price(price.toString());
        return this;
    }

    async clock(): Promise<ThenGivenClockPort> {
        const { ThenGivenClock } = await import('./ThenGivenClock.js');
        const verification = (await this.app.clock().getTime().execute()).shouldSucceed();
        return new ThenGivenClock(this.app, verification);
    }

    async product(skuAlias: string): Promise<ThenGivenProductPort> {
        const verification = (await this.app.erp().getProduct().sku(skuAlias).execute()).shouldSucceed();
        return new ThenGivenProduct(this.app, verification);
    }

    async country(countryAlias: string): Promise<ThenGivenCountryPort> {
        const { ThenGivenCountry } = await import('./ThenGivenCountry.js');
        const verification = (await this.app.tax().getTaxRate().country(countryAlias).execute()).shouldSucceed();
        return new ThenGivenCountry(this.app, verification);
    }
}
