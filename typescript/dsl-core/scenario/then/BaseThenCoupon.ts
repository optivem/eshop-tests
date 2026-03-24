import type { ResponseVerification } from '@optivem/dsl-core/shared';
import type { ExecutionResult } from '../ExecutionResult.js';
import type { BrowseCouponsVerification } from '../../usecase/shop/usecases/BrowseCouponsVerification.js';
import type { ThenClause } from './Then.js';

/**
 * Base deferred coupon verifier. Collects has*() assertions as lambdas and only
 * executes when awaited.
 */
export abstract class BaseThenCouponVerifier<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> implements PromiseLike<void> {
    protected readonly verifications: Array<(code: string, v: BrowseCouponsVerification) => void> = [];

    constructor(
        protected readonly thenClause: ThenClause<TSuccessResponse, TSuccessVerification>,
        protected readonly couponCodeFactory: () => Promise<string>
    ) {}

    protected abstract runPrelude(result: ExecutionResult<TSuccessResponse, TSuccessVerification>): void;

    and(): this {
        return this;
    }

    hasDiscountRate(discountRate: number): this {
        this.verifications.push((code, v) => v.couponHasDiscountRate(code, discountRate));
        return this;
    }

    isValidFrom(validFrom: string): this {
        this.verifications.push((code, v) => v.couponHasValidFrom(code, validFrom));
        return this;
    }

    isValidTo(validTo: string): this {
        this.verifications.push((code, v) => v.couponHasValidTo(code, validTo));
        return this;
    }

    hasUsageLimit(usageLimit: number): this {
        this.verifications.push((code, v) => v.couponHasUsageLimit(code, usageLimit));
        return this;
    }

    hasUsedCount(expectedUsedCount: number): this {
        this.verifications.push((code, v) => v.couponHasUsedCount(code, expectedUsedCount));
        return this;
    }

    /** PromiseLike — when awaited, executes the full chain. */
    then<TResult1 = void, TResult2 = never>(
        onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | null,
        onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
    ): PromiseLike<TResult1 | TResult2> {
        return this.execute().then(onfulfilled, onrejected);
    }

    private async execute(): Promise<void> {
        const result = await this.thenClause.getExecutionResult();
        this.runPrelude(result);

        const couponCode = await this.couponCodeFactory();
        const browseResult = await this.thenClause.app
            .shop()
            .browseCoupons()
            .execute();
        const verification = browseResult.shouldSucceed();
        verification.hasCouponWithCode(couponCode);

        for (const v of this.verifications) {
            v(couponCode, verification);
        }
    }
}


