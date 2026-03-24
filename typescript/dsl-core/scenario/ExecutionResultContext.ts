import type { Optional } from '@optivem/commons';

export class ExecutionResultContext {
    private static readonly EMPTY = new ExecutionResultContext(null, null);

    constructor(
        private readonly orderNumber: Optional<string>,
        private readonly couponCode: Optional<string>
    ) {}

    static empty(): ExecutionResultContext {
        return ExecutionResultContext.EMPTY;
    }

    getOrderNumber(): Optional<string> {
        return this.orderNumber;
    }

    getCouponCode(): Optional<string> {
        return this.couponCode;
    }
}
