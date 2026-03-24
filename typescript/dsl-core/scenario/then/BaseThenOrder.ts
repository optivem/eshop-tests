import type { ResponseVerification } from '@optivem/dsl-core/shared';
import type { ExecutionResult } from '../ExecutionResult.js';
import type { ViewOrderVerification } from '../../usecase/shop/usecases/ViewOrderVerification.js';
import { OrderStatus } from '@optivem/driver-port/shop/dtos/OrderStatus.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import type { ThenClause } from './Then.js';

/**
 * Base deferred order verifier. Collects has*() assertions as lambdas and only
 * executes when awaited — matching .NET's BaseThenResultOrder<T> + GetAwaiter().
 *
 * Subclasses override runPrelude() to handle success vs failure paths.
 */
export abstract class BaseThenOrderVerifier<
    TSuccessResponse,
    TSuccessVerification extends ResponseVerification<TSuccessResponse>
> implements PromiseLike<void> {
    protected readonly verifications: Array<(v: ViewOrderVerification) => void> = [];

    constructor(
        protected readonly thenClause: ThenClause<TSuccessResponse, TSuccessVerification>,
        protected readonly orderNumberFactory: () => Promise<string>
    ) {}

    protected abstract runPrelude(result: ExecutionResult<TSuccessResponse, TSuccessVerification>): void;

    and(): this {
        return this;
    }

    hasSku(expectedSku: string): this {
        this.verifications.push((v) => v.sku(expectedSku));
        return this;
    }

    hasQuantity(expectedQuantity: number): this {
        this.verifications.push((v) => v.quantity(expectedQuantity));
        return this;
    }

    hasCountry(expectedCountry: string): this {
        this.verifications.push((v) => v.country(expectedCountry));
        return this;
    }

    hasUnitPrice(expectedUnitPrice: number): this {
        this.verifications.push((v) => v.unitPrice(expectedUnitPrice));
        return this;
    }

    hasBasePrice(expectedBasePrice: number): this;
    hasBasePrice(basePrice: string): this;
    hasBasePrice(basePrice: number | string): this {
        this.verifications.push((v) => v.basePrice(basePrice));
        return this;
    }

    hasSubtotalPrice(expectedSubtotalPrice: number): this;
    hasSubtotalPrice(expectedSubtotalPrice: string): this;
    hasSubtotalPrice(expectedSubtotalPrice: number | string): this {
        this.verifications.push((v) =>
            v.subtotalPrice(
                typeof expectedSubtotalPrice === 'string' ? parseFloat(expectedSubtotalPrice) : expectedSubtotalPrice
            )
        );
        return this;
    }

    hasTotalPrice(expectedTotalPrice: number): this;
    hasTotalPrice(expectedTotalPrice: string): this;
    hasTotalPrice(expectedTotalPrice: number | string): this {
        this.verifications.push((v) => v.totalPrice(expectedTotalPrice));
        return this;
    }

    hasStatus(expectedStatus: OrderStatus): this {
        this.verifications.push((v) => v.status(expectedStatus));
        return this;
    }

    hasDiscountRateGreaterThanOrEqualToZero(): this {
        this.verifications.push((v) => v.discountRateGreaterThanOrEqualToZero());
        return this;
    }

    hasDiscountRate(expectedDiscountRate: number): this {
        this.verifications.push((v) => v.discountRate(expectedDiscountRate));
        return this;
    }

    hasDiscountAmount(expectedDiscountAmount: number): this;
    hasDiscountAmount(expectedDiscountAmount: string): this;
    hasDiscountAmount(expectedDiscountAmount: number | string): this {
        this.verifications.push((v) => v.discountAmount(expectedDiscountAmount));
        return this;
    }

    hasAppliedCoupon(expectedCouponCode: string | null): this;
    hasAppliedCoupon(): this;
    hasAppliedCoupon(expectedCouponCode?: string | null): this {
        const resolved = expectedCouponCode === undefined ? GherkinDefaults.DEFAULT_COUPON_CODE : expectedCouponCode;
        this.verifications.push((v) => v.appliedCouponCode(resolved));
        return this;
    }

    hasDiscountAmountGreaterThanOrEqualToZero(): this {
        this.verifications.push((v) => v.discountAmountGreaterThanOrEqualToZero());
        return this;
    }

    hasSubtotalPriceGreaterThanZero(): this {
        this.verifications.push((v) => v.subtotalPriceGreaterThanZero());
        return this;
    }

    hasTaxRate(expectedTaxRate: number): this;
    hasTaxRate(expectedTaxRate: string): this;
    hasTaxRate(expectedTaxRate: number | string): this {
        this.verifications.push((v) => v.taxRate(expectedTaxRate));
        return this;
    }

    hasTaxRateGreaterThanOrEqualToZero(): this {
        this.verifications.push((v) => v.taxRateGreaterThanOrEqualToZero());
        return this;
    }

    hasTaxAmount(expectedTaxAmount: number): this;
    hasTaxAmount(expectedTaxAmount: string): this;
    hasTaxAmount(expectedTaxAmount: number | string): this {
        this.verifications.push((v) => v.taxAmount(expectedTaxAmount));
        return this;
    }

    hasTaxAmountGreaterThanOrEqualToZero(): this {
        this.verifications.push((v) => v.taxAmountGreaterThanOrEqualToZero());
        return this;
    }

    hasTotalPriceGreaterThanZero(): this {
        this.verifications.push((v) => v.totalPriceGreaterThanZero());
        return this;
    }

    hasOrderNumberPrefix(expectedPrefix: string): this {
        this.verifications.push((v) => v.orderNumberHasPrefix(expectedPrefix));
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

        const orderNumber = await this.orderNumberFactory();
        const viewOrderResult = await this.thenClause.app
            .shop()
            .viewOrder()
            .orderNumber(orderNumber)
            .execute();
        const verification = viewOrderResult.shouldSucceed();

        for (const v of this.verifications) {
            v(verification);
        }
    }
}


