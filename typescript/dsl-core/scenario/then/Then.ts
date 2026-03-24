import type { ResponseVerification } from '@optivem/dsl-core/shared';
import type { UseCaseDsl } from '../../usecase/UseCaseDsl.js';
import type { ExecutionResult } from '../ExecutionResult.js';
import { ThenSuccessVerifier } from './ThenSuccess.js';
import { ThenFailureVerifier } from './ThenFailure.js';

/**
 * Holds a deferred (lazy) execution of a when-step.
 * shouldSucceed() / shouldFail() are synchronous; I/O runs only when the returned
 * verifier is awaited — enabling a single await at the top of the chain, like .NET.
 */
export class ThenClause<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> {
    private _executionResult?: ExecutionResult<TSuccessResponse, TSuccessVerification>;
    private _executed = false;

    constructor(
        readonly app: UseCaseDsl,
        private readonly lazyExecute: () => Promise<ExecutionResult<TSuccessResponse, TSuccessVerification>>
    ) {}

    async getExecutionResult(): Promise<ExecutionResult<TSuccessResponse, TSuccessVerification>> {
        if (!this._executed) {
            this._executionResult = await this.lazyExecute();
            this._executed = true;
        }
        return this._executionResult!;
    }

    shouldSucceed(): ThenSuccessVerifier<TSuccessResponse, TSuccessVerification> {
        return new ThenSuccessVerifier(this.app, this);
    }

    shouldFail(): ThenFailureVerifier<TSuccessResponse, TSuccessVerification> {
        return new ThenFailureVerifier(this.app, this);
    }
}


