import type { ResponseVerification } from '@optivem/dsl-core/shared';
import type { ExecutionResult } from '../ExecutionResult.js';
import type { SystemErrorFailureVerification } from '../../usecase/shop/usecases/base/SystemErrorFailureVerification.js';
import { BaseThenOrderVerifier } from './BaseThenOrder.js';
import type { ThenClause } from './Then.js';

/**
 * Deferred order verifier for the failure path.
 * runPrelude calls shouldFail() and runs the collected failure assertions.
 */
export class ThenFailureOrderVerifier<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> extends BaseThenOrderVerifier<TSuccessResponse, TSuccessVerification> {
    private readonly failureAssertions: Array<(v: SystemErrorFailureVerification) => void>;

    constructor(
        thenClause: ThenClause<TSuccessResponse, TSuccessVerification>,
        failureAssertions: Array<(v: SystemErrorFailureVerification) => void>,
        orderNumberFactory: () => Promise<string>
    ) {
        super(thenClause, orderNumberFactory);
        this.failureAssertions = failureAssertions;
    }

    protected runPrelude(result: ExecutionResult<TSuccessResponse, TSuccessVerification>): void {
        const failureVerification = result.getResult().shouldFail();
        for (const assertion of this.failureAssertions) {
            assertion(failureVerification);
        }
    }
}


