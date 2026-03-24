import type { ResponseVerification } from '@optivem/dsl-core/shared';
import type { ExecutionResult } from '../ExecutionResult.js';
import type { SystemErrorFailureVerification } from '../../usecase/shop/usecases/base/SystemErrorFailureVerification.js';
import { BaseThenCouponVerifier } from './BaseThenCoupon.js';
import type { ThenClause } from './Then.js';

/**
 * Deferred coupon verifier for the failure path.
 */
export class ThenFailureCouponVerifier<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> extends BaseThenCouponVerifier<TSuccessResponse, TSuccessVerification> {
    private readonly failureAssertions: Array<(v: SystemErrorFailureVerification) => void>;

    constructor(
        thenClause: ThenClause<TSuccessResponse, TSuccessVerification>,
        failureAssertions: Array<(v: SystemErrorFailureVerification) => void>,
        couponCodeFactory: () => Promise<string>
    ) {
        super(thenClause, couponCodeFactory);
        this.failureAssertions = failureAssertions;
    }

    protected runPrelude(result: ExecutionResult<TSuccessResponse, TSuccessVerification>): void {
        const failureVerification = result.getResult().shouldFail();
        for (const assertion of this.failureAssertions) {
            assertion(failureVerification);
        }
    }
}


