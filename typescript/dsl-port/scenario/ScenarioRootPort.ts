import type { AssumeStagePort } from './assume/AssumeStagePort.js';
import type { GivenClausePort } from './given/GivenStagePort.js';
import type { WhenClausePort } from './when/WhenStagePort.js';

export interface ScenarioDslPort {
    assume(): AssumeStagePort;
    given(): GivenClausePort;
    when(): WhenClausePort;
    markAsExecuted(): void;
}
