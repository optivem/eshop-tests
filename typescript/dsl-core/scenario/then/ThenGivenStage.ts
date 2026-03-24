import type { UseCaseDsl } from '../../usecase/UseCaseDsl.js';
import type {
    ThenGivenStagePort,
    ThenGivenClockPort,
    ThenGivenProductPort,
    ThenGivenCountryPort,
} from '@optivem/dsl-port/scenario/ScenarioDslPort.js';
import { ThenGivenClock } from './ThenGivenClock.js';
import { ThenGivenProduct } from './ThenGivenProduct.js';
import { ThenGivenCountry } from './ThenGivenCountry.js';

export class ThenGivenStage implements ThenGivenStagePort {
    private setupExecuted = false;

    constructor(
        private readonly app: UseCaseDsl,
        private readonly givenSetup: () => Promise<void>
    ) {}

    private async ensureSetup(): Promise<void> {
        if (!this.setupExecuted) {
            await this.givenSetup();
            this.setupExecuted = true;
        }
    }

    async clock(): Promise<ThenGivenClockPort> {
        await this.ensureSetup();
        const verification = (await this.app.clock().getTime().execute()).shouldSucceed();
        return new ThenGivenClock(this.app, verification);
    }

    async product(skuAlias: string): Promise<ThenGivenProductPort> {
        await this.ensureSetup();
        const verification = (
            await this.app.erp().getProduct().sku(skuAlias).execute()
        ).shouldSucceed();
        return new ThenGivenProduct(this.app, verification);
    }

    async country(countryAlias: string): Promise<ThenGivenCountryPort> {
        await this.ensureSetup();
        const verification = (
            await this.app.tax().getTaxRate().country(countryAlias).execute()
        ).shouldSucceed();
        return new ThenGivenCountry(this.app, verification);
    }
}
