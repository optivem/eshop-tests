import type { ResponseVerification } from '@optivem/dsl-core/shared';
import type { UseCaseDsl } from '../../usecase/UseCaseDsl.js';
import type { SystemErrorFailureVerification } from '../../usecase/shop/usecases/base/SystemErrorFailureVerification.js';
import type { ThenClause } from './Then.js';
import { ThenFailureAnd } from './ThenFailureAnd.js';

/**
 * Deferred failure verifier. Collects ErrorMessage/FieldErrorMessage assertions before
 * awaiting.
 *
 * .and() returns a bridge to .order() / .coupon() for the failure path, enabling
 * single-chain patterns like:
 *   await ...then().shouldFail().errorMessage('...').and().order().hasStatus(OrderStatus.PLACED);
 */
export class ThenFailureVerifier<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> implements PromiseLike<void> {

    private readonly assertions: Array<(v: SystemErrorFailureVerification) => void> = [];

    constructor(
        private readonly app: UseCaseDsl,
        private readonly thenClause: ThenClause<TSuccessResponse, TSuccessVerification>
    ) {}

    errorMessage(expectedMessage: string): this {
        this.assertions.push((v) => v.errorMessage(expectedMessage));
        return this;
    }

    fieldErrorMessage(expectedField: string, expectedMessage: string): this {
        this.assertions.push((v) => v.fieldErrorMessage(expectedField, expectedMessage));
        return this;
    }

    /**
     * Returns a bridge to .order() / .coupon() that carries the collected failure assertions.
     */
    and(): ThenFailureAnd<TSuccessResponse, TSuccessVerification> {
        return new ThenFailureAnd<TSuccessResponse, TSuccessVerification>(this.app, this.thenClause, this.assertions);
    }

    /** Makes the verifier awaitable — runs I/O and applies all collected assertions. */
    then<TResult1 = void, TResult2 = never>(
        onfulfilled?: ((value: void) => TResult1 | PromiseLike<TResult1>) | null,
        onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
    ): PromiseLike<TResult1 | TResult2> {
        return this.executeAssertions().then(onfulfilled, onrejected);
    }

    private async executeAssertions(): Promise<void> {
        const result = await this.thenClause.getExecutionResult();
        const failureVerification = result.getResult().shouldFail();
        for (const assertion of this.assertions) {
            assertion(failureVerification);
        }
    }
}


