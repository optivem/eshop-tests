import type { UseCaseDsl } from '../usecase/UseCaseDsl.js';
import type { ScenarioDslPort } from '@optivem/dsl-port/scenario/ScenarioDslPort.js';
import { AssumeStage } from './assume/AssumeStage.js';
import { GivenClause } from './given/Given.js';
import { WhenClause } from './when/When.js';

export class ScenarioDsl implements ScenarioDslPort {
    private executed = false;

    constructor(private readonly app: UseCaseDsl) {}

    assume(): AssumeStage {
        return new AssumeStage(this.app);
    }

    given(): GivenClause {
        this.ensureNotExecuted();
        return new GivenClause(this.app);
    }

    when(): WhenClause {
        this.ensureNotExecuted();
        return new WhenClause(this.app);
    }

    markAsExecuted(): void {
        this.executed = true;
    }

    private ensureNotExecuted(): void {
        if (this.executed) {
            throw new Error(
                'Scenario has already been executed. ' +
                    'Each test method should contain only ONE scenario execution (Given-When-Then). ' +
                    'Split multiple scenarios into separate test methods.'
            );
        }
    }
}
