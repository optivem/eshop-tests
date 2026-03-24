import type { ResponseVerification } from '@optivem/dsl-core/shared';
import type { ExecutionResult } from '../ExecutionResult.js';
import { BaseThenCouponVerifier } from './BaseThenCoupon.js';
import type { ThenClause } from './Then.js';

/**
 * Deferred coupon verifier for the success path.
 */
export class ThenSuccessCouponVerifier<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> extends BaseThenCouponVerifier<TSuccessResponse, TSuccessVerification> {

    protected runPrelude(result: ExecutionResult<TSuccessResponse, TSuccessVerification>): void {
        result.getResult().shouldSucceed();
    }
}


