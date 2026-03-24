import type { ResponseVerification } from '@optivem/dsl-core/shared';
import type { UseCaseDsl } from '../../usecase/UseCaseDsl.js';
import type { SystemErrorFailureVerification } from '../../usecase/shop/usecases/base/SystemErrorFailureVerification.js';
import type { ThenClause } from './Then.js';
import { ThenFailureOrderVerifier } from './ThenFailureOrder.js';
import { ThenFailureCouponVerifier } from './ThenFailureCoupon.js';
import type { ThenGivenClockPort, ThenGivenProductPort, ThenGivenCountryPort } from '@optivem/dsl-port/scenario/ScenarioDslPort.js';
import { ThenGivenClock } from './ThenGivenClock.js';
import { ThenGivenProduct } from './ThenGivenProduct.js';
import { ThenGivenCountry } from './ThenGivenCountry.js';

/**
 * Returned by .shouldFail().and() — bridges to .order() / .coupon() on the failure path.
 */
export class ThenFailureAnd<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> {
    constructor(
        private readonly app: UseCaseDsl,
        private readonly thenClause: ThenClause<TSuccessResponse, TSuccessVerification>,
        private readonly failureAssertions: Array<(v: SystemErrorFailureVerification) => void>
    ) {}

    order(orderNumber?: string): ThenFailureOrderVerifier<TSuccessResponse, TSuccessVerification> {
        const thenClause = this.thenClause;
        const assertions = this.failureAssertions;
        const orderNumberFactory = async (): Promise<string> => {
            if (orderNumber != null) return orderNumber;
            const result = await thenClause.getExecutionResult();
            const context = result.getContext();
            const resolved = context.getOrderNumber();
            if (resolved == null) {
                throw new Error('Cannot verify order: no order number available from the executed operation');
            }
            return resolved;
        };
        return new ThenFailureOrderVerifier<TSuccessResponse, TSuccessVerification>(thenClause, assertions, orderNumberFactory);
    }

    coupon(couponCode?: string): ThenFailureCouponVerifier<TSuccessResponse, TSuccessVerification> {
        const thenClause = this.thenClause;
        const assertions = this.failureAssertions;
        const couponCodeFactory = async (): Promise<string> => {
            if (couponCode != null) return couponCode;
            const result = await thenClause.getExecutionResult();
            const context = result.getContext();
            const resolved = context.getCouponCode();
            if (resolved == null) {
                throw new Error('Cannot verify coupon: no coupon code available from the executed operation');
            }
            return resolved;
        };
        return new ThenFailureCouponVerifier<TSuccessResponse, TSuccessVerification>(thenClause, assertions, couponCodeFactory);
    }

    async clock(): Promise<ThenGivenClockPort> {
        const verification = (await this.app.clock().getTime().execute()).shouldSucceed();
        return new ThenGivenClock(this.app, verification);
    }

    async product(skuAlias: string): Promise<ThenGivenProductPort> {
        const verification = (await this.app.erp().getProduct().sku(skuAlias).execute()).shouldSucceed();
        return new ThenGivenProduct(this.app, verification);
    }

    async country(countryAlias: string): Promise<ThenGivenCountryPort> {
        const verification = (await this.app.tax().getTaxRate().country(countryAlias).execute()).shouldSucceed();
        return new ThenGivenCountry(this.app, verification);
    }
}


