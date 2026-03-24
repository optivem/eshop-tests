import type { ThenGivenClockPort, ThenGivenProductPort, ThenGivenCountryPort } from '@optivem/dsl-port/scenario/ScenarioDslPort.js';
import type { GetTimeVerification } from '../../usecase/external/clock/usecases/GetTimeVerification.js';
import type { UseCaseDsl } from '../../usecase/UseCaseDsl.js';

export class ThenGivenClock implements ThenGivenClockPort {
    constructor(
        private readonly app: UseCaseDsl,
        private readonly verification: GetTimeVerification
    ) {}

    hasTime(time: string): ThenGivenClockPort;
    hasTime(): ThenGivenClockPort;
    hasTime(time?: string): ThenGivenClockPort {
        if (time !== undefined) {
            this.verification.time(time);
        } else {
            this.verification.timeIsNotNull();
        }
        return this;
    }

    async clock(): Promise<ThenGivenClockPort> {
        const verification = (await this.app.clock().getTime().execute()).shouldSucceed();
        return new ThenGivenClock(this.app, verification);
    }

    async product(skuAlias: string): Promise<ThenGivenProductPort> {
        const { ThenGivenProduct } = await import('./ThenGivenProduct.js');
        const verification = (await this.app.erp().getProduct().sku(skuAlias).execute()).shouldSucceed();
        return new ThenGivenProduct(this.app, verification);
    }

    async country(countryAlias: string): Promise<ThenGivenCountryPort> {
        const { ThenGivenCountry } = await import('./ThenGivenCountry.js');
        const verification = (await this.app.tax().getTaxRate().country(countryAlias).execute()).shouldSucceed();
        return new ThenGivenCountry(this.app, verification);
    }
}
