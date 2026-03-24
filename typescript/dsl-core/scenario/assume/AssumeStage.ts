import type { AssumeRunningPort, AssumeStagePort } from '@optivem/dsl-port/scenario/ScenarioDslPort.js';
import type { UseCaseDsl } from '../../usecase/UseCaseDsl.js';

export class AssumeStage implements AssumeStagePort {
    constructor(private readonly app: UseCaseDsl) {}

    shop(): AssumeRunningPort {
        return new AssumeRunningAction(async () => {
            (await this.app.shop().goToShop().execute()).shouldSucceed();
        }, this);
    }

    erp(): AssumeRunningPort {
        return new AssumeRunningAction(async () => {
            (await this.app.erp().goToErp().execute()).shouldSucceed();
        }, this);
    }

    tax(): AssumeRunningPort {
        return new AssumeRunningAction(async () => {
            (await this.app.tax().goToTax().execute()).shouldSucceed();
        }, this);
    }

    clock(): AssumeRunningPort {
        return new AssumeRunningAction(async () => {
            (await this.app.clock().goToClock().execute()).shouldSucceed();
        }, this);
    }
}

class AssumeRunningAction implements AssumeRunningPort {
    constructor(
        private readonly action: () => Promise<void>,
        private readonly assumeStage: AssumeStagePort
    ) {}

    async shouldBeRunning(): Promise<AssumeStagePort> {
        await this.action();
        return this.assumeStage;
    }
}
