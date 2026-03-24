import { Converter } from '@optivem/commons';
import type { Optional } from '@optivem/commons';
import type { UseCaseDsl } from '../../usecase/UseCaseDsl.js';
import { OrderStatus } from '@optivem/driver-port/shop/dtos/OrderStatus.js';
import { GherkinDefaults } from '../GherkinDefaults.js';
import { BaseGivenBuilder } from './BaseGivenStep.js';
import type { GivenClause } from './Given.js';

export class GivenOrderBuilder extends BaseGivenBuilder {
    private orderNumber: Optional<string>;
    private sku: Optional<string>;
    private quantity: Optional<string>;
    private country: Optional<string>;
    private couponCodeAlias: Optional<string>;
    private status!: OrderStatus;

    constructor(givenClause: GivenClause) {
        super(givenClause);
        this.orderNumber = GherkinDefaults.DEFAULT_ORDER_NUMBER;
        this.sku = GherkinDefaults.DEFAULT_SKU;
        this.quantity = GherkinDefaults.DEFAULT_QUANTITY;
        this.country = GherkinDefaults.DEFAULT_COUNTRY;
        this.couponCodeAlias = GherkinDefaults.EMPTY;
        this.status = GherkinDefaults.DEFAULT_ORDER_STATUS;
    }

    withOrderNumber(orderNumber: Optional<string>): this {
        this.orderNumber = orderNumber;
        return this;
    }

    withSku(sku: Optional<string>): this {
        this.sku = sku;
        return this;
    }

    withQuantity(quantity: Optional<string>): this;
    withQuantity(quantity: number): this;
    withQuantity(quantity: Optional<string> | number): this {
        this.quantity = typeof quantity === 'number' ? (Converter.fromInteger(quantity) ?? undefined) : quantity;
        return this;
    }

    withCountry(country: Optional<string>): this {
        this.country = country;
        return this;
    }

    withCouponCode(couponCodeAlias: Optional<string>): this {
        this.couponCodeAlias = couponCodeAlias;
        return this;
    }

    withStatus(status: OrderStatus): this {
        this.status = status;
        return this;
    }

    async execute(app: UseCaseDsl): Promise<void> {
        await app.shop()
            .placeOrder()
            .orderNumber(this.orderNumber)
            .sku(this.sku)
            .quantity(this.quantity)
            .country(this.country)
            .couponCode(this.couponCodeAlias)
            .execute()
            .then((r) => r.shouldSucceed());

        if (this.status === OrderStatus.CANCELLED) {
            await app.shop()
                .cancelOrder()
                .orderNumber(this.orderNumber)
                .execute()
                .then((r) => r.shouldSucceed());
        }
    }
}

