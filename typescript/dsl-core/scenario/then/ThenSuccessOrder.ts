import type { ResponseVerification } from '@optivem/dsl-core/shared';
import type { ExecutionResult } from '../ExecutionResult.js';
import { BaseThenOrderVerifier } from './BaseThenOrder.js';
import type { ThenClause } from './Then.js';

/**
 * Deferred order verifier for the success path.
 * runPrelude calls shouldSucceed() on the execution result.
 */
export class ThenSuccessOrderVerifier<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> extends BaseThenOrderVerifier<TSuccessResponse, TSuccessVerification> {

    protected runPrelude(result: ExecutionResult<TSuccessResponse, TSuccessVerification>): void {
        result.getResult().shouldSucceed();
    }
}


